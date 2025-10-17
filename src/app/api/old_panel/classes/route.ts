import { db } from "@/db";
import { items, classes } from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { classSchema } from "@/validations/panel/classValidator";

export async function GET() {
  const res = await db.query.classes.findMany({
    orderBy: desc(classes.id),
  });

  const itemCache = await db.query.items.findMany({ orderBy: asc(items.id) });
  
  const modified = res.map((itemClass) => {
    return {
      ...itemClass,
      Name: `${
        itemCache.find((item) => item.id === itemClass.ItemID)?.Name || "None"
      }`,
    };
  });

  return Response.json(modified);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await classSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.classes.findFirst({
    where: eq(classes.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const itemExist = await db.query.items.findFirst({
    where: eq(items.id, data.ItemID),
  });
  if (!itemExist) {
    errors.ItemID = "Item ID does not exist";
  }

  const itemConflict = await db.query.classes.findFirst({
    where: eq(classes.ItemID, data.ItemID),
  });
  if (itemConflict) {
    errors.ItemID = "Item ID already assigned";
  }

  const isItemClass = await db.query.items.findFirst({
    where: and(
      eq(items.id, data.ItemID),
      eq(items.Equipment, "ar")
    ),
  });
  if (!isItemClass) errors.ItemID = "Item is not a class";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(classes).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json("Failed to create " + error, { status: 400 });
  }
}
