import { db } from "@/db";
import { items, items_requirements } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { requirementSchema } from "@/validations/panel/itemValidator";
import { get } from "http";
import { getEquipmentByType } from "@/lib/utils";

export async function GET() {
  const res = await db.query.items_requirements.findMany({
    orderBy: desc(items_requirements.id),
  });

  const itemObj = await db.query.items.findMany();

  const modified = res.map((item) => {
    return {
      ...item,
      ItemName: `${
        itemObj.find((p) => p.id === item.ItemID)?.Name || "None"
      }`,
      ReqItemName: `${
        itemObj.find((p) => p.id === item.ReqItemID)?.Name || "None"
      }`,
    };
  });

  return Response.json(modified);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await requirementSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.items_requirements.findFirst({
    where: eq(items_requirements.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const itemExist = await db.query.items.findFirst({
    where: eq(items.id, data.ItemID),
  });
  if (!itemExist) errors.ItemID = "Item ID does not exist";

  const reqItemExist = await db.query.items.findFirst({
    where: eq(items.id, data.ReqItemID),
  });
  if (!reqItemExist) errors.ReqItemID = "Required Item ID does not exist";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(items_requirements).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    return Response.json("Failed to create", { status: 400 });
  }
}
