import { db } from "@/db";
import { titles_styles } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { decorationSchema } from "@/validations/panel/titleValidator";

export async function GET() {
  const res = await db.query.titles_styles.findMany({
    orderBy: desc(titles_styles.id),
  });
  return Response.json(res);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await decorationSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.titles_styles.findFirst({
    where: eq(titles_styles.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const nameConflict = await db.query.titles_styles.findFirst({
    where: eq(titles_styles.Name, data.Name),
  });
  if (nameConflict) errors.Name = "Name already exists";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(titles_styles).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json("Failed to create " + error, { status: 400 });
  }
}