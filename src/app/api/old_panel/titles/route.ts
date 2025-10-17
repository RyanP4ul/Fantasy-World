import { db } from "@/db";
import { titles } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { titleSchema } from "@/validations/panel/titleValidator";

export async function GET() {
  const res = await db.query.titles.findMany({
    orderBy: desc(titles.id),
  });

  const modified = res.map((data) => {
    return {
      ...data,
      Color: String(data.Color).replace("0x", "#") || "#000000",
    };
  });

  return Response.json(modified);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await titleSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.titles.findFirst({
    where: eq(titles.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const nameConflict = await db.query.titles.findFirst({
    where: eq(titles.Name, data.Name),
  });
  if (nameConflict) errors.Name = "Name already exists";

  
  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });
  
  if (data.Color && String(data.Color).startsWith("#")) {
    data.Color = String(data.Color).replace("#", "0x");
  }

  try {
    const res = await db.insert(titles).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json("Failed to create " + error, { status: 400 });
  }
}
