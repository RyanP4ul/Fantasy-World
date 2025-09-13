import { get } from "http";
import { hash } from "bcryptjs";
import { db } from "@/db";
import { eq, or } from "drizzle-orm";
import { registerSchema } from "@/validations/authValidator";
import { settings_login, users, users_items } from "@/db/schema";

export async function POST(req: Request) {
  const data = await req.json();

  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  // const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "0.0.0.0";
  const ip =
    forwardedFor?.split(",")[0].trim() ||
    realIp ||
    "127.0.0.1";
  let country = "XX";

  // Validate data
  const parsed = await registerSchema.safeParseAsync(data);
  if (!parsed.success) return Response.json("Invalid data", { status: 400 });

  const errors: Record<string, string> = {};

  // Check if username exists
  const existName = await db.query.users.findFirst({
    where: eq(users.Name, data.username),
  });
  if (existName) errors.username = "Username already exists";

  // Check password match
  if (data.password !== data.retype_password)
    errors.retype_password = "Passwords do not match";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const webSetting = await db.query.settings_login.findMany({
      where: or(
        eq(settings_login.name, "CanRegister"),
        eq(settings_login.name, "MaxRegisterPerDay"),
        eq(settings_login.name, "MaxAccountPerIp")
      ),
    });

    if (!webSetting || webSetting.length < 3)
      return Response.json("Error!", { status: 400 });

    const canRegister = webSetting[0].value == "1";
    const maxRegisterPerDay = Number(webSetting[1].value);
    const maxAccountPerIp = Number(webSetting[2].value);

    if (!canRegister)
      return Response.json(
        "Registration is unavailable right now. Please try again later.",
        { status: 400 }
      );

    const [usersToday] = (await db.execute(
      "SELECT COUNT(*) as rowCount FROM users WHERE DateCreated > NOW() - INTERVAL 1 DAY"
    )) as any;

    if (usersToday[0].rowCount >= maxRegisterPerDay)
      return Response.json("Registration limit exceeded", { status: 400 });

    if (ip != "::1") {
      const res = await fetch(
        `http://ip-api.com/json/${ip}?fields=status,message,query,isp,org,as,hosting,proxy,countryCode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
          body: JSON.stringify(req.body),
        }
      );
  
      const geoData = await res.json();
  
      if (geoData.status !== "success") {
        return Response.json("An error occurred while creating your account! " + ip, { status: 400 });
      }
  
      if (geoData.proxy || geoData.hosting) {
        return Response.json("Proxy or hosting detected", { status: 400 });
      }

      country = geoData.countryCode || "XX";
    }

    const userIp = await db.query.users.findMany({
      where: eq(users.Address, ip),
    });

    if (userIp.length > maxAccountPerIp) {
      return Response.json("Max accounts exceeded!", { status: 400 });
    }

    await db.transaction(async (tx) => {
      const user = await tx.insert(users).values({
        Name: data.username,
        Hash: await hash(data.password, 10),
        Email: data.email,
        Gender: data.gender,
        Country: country,
        Address: ip,
      } as any);

      const id = user[0].insertId;

      await tx.insert(users_items).values([
        { UserID: id, ItemID: 1, Equipped: 1 },
        { UserID: id, ItemID: 2, Equipped: 1 },
      ] as any);

      return id;
    });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    return Response.json("Failed to create", { status: 400 });
  }
}
