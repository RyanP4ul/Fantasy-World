import { db } from "@/db";
import { web_posts, users } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { webPostSchema } from "@/validations/panel/webSchema";

export async function GET() {
  const res = await db.query.web_posts.findMany({
    orderBy: desc(web_posts.id),
  });

  const userObj = await db.query.users.findMany({ orderBy: asc(users.id) });

  const modified = res.map((data) => {
    return {
      ...data,
      User: `${
        userObj.find((user) => user.id === data.UserID)?.Name || "None"
      }`,
    };
  });

  return Response.json(modified);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await webPostSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.web_posts.findFirst({
    where: eq(web_posts.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const titleConflict = await db.query.web_posts.findFirst({
    where: eq(web_posts.Title, data.Title),
  });
  if (titleConflict) errors.Title = "Title already exists";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(web_posts).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json("Failed to create " + error, { status: 400 });
  }
}