import { db } from "@/db";
import { items } from "@/db/schema";
import { and, asc, desc, eq, inArray, not } from "drizzle-orm";
import { itemSchema } from "@/validations/panel/itemValidator";
import { equipments, getEquipmentByType } from "@/lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const equipment = searchParams.get("equipment") || "all";

  if (equipment !== "all" && !equipments.includes(equipment)) {
    return Response.json("Invalid equipment type", { status: 400 });
  }

  const res = equipment === "all" ? await db.query.items.findMany({
    orderBy: desc(items.id),
  }) : await db.query.items.findMany({
    orderBy: desc(items.id),
    where: eq(items.Equipment, equipment),
  });

  const modified = res.map(item => ({
    ...item,
    File: item.File?.indexOf("/") !== -1 ? item.File?.split("/")[2] : item.File
  }));

  return Response.json(modified);
}

export async function POST(req: Request) {
  let data = await req.json();
  const errors: Record<string, string> = {};

  if ((await itemSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.items.findFirst({
    where: eq(items.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const nameConflict = await db.query.items.findFirst({
    where: eq(items.Name, data.Name),
  });
  if (nameConflict) errors.Name = "Name already exists";

  const factionExist = await db.query.items.findFirst({
    where: eq(items.FactionID, data.FactionID),
  });
  if (!factionExist) errors.FactionID = "Faction ID does not exist";

  const enhExist = await db.query.items.findFirst({
    where: eq(items.EnhID, data.EnhID),
  });
  if (!enhExist) errors.EnhID = "Enhancement ID does not exist";

  const reqClassExist = await db.query.items.findFirst({
    where: eq(items.ReqClassID, data.ReqClassID),
  });
  if (!reqClassExist) errors.ReqClassID = "Required Class ID does not exist";

  if (Object.keys(errors).length > 0) return Response.json({ errors }, { status: 400 });

  // let equipment = "None";

  // if (data.Equipment === "Enhancement") {
  //   equipment = data.Equipment;
  // } else {
  //   equipment = data.Equipment === "Enhancement" ? data.Equipment : getEquipmentByType(data.Type);
  
  //   if (!equipment || equipment === "Unknown") return Response.json("Unknown type", { status: 400 });
  // }

    const equipment = data.Type === "Enhancement" ? data.Equipment : getEquipmentByType(data.Type);
  
    if (!equipment || equipment === "Unknown") return Response.json("Unknown type", { status: 400 });

  data = {
    ...data,
    Equipment: equipment
  };

  try {
    const res = await db.insert(items).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    return Response.json("Failed to create", { status: 400 });
  }
}
