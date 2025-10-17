import { db } from "@/db";
import { items, quests, quests_requirements } from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { reqSchema } from "@/validations/panel/questValidator";

export async function GET() {
  const res = await db.query.quests_requirements.findMany({
    orderBy: desc(quests_requirements.id),
  });

  const questsCache = await db.query.quests.findMany({ orderBy: asc(quests.id) });
  const itemsCache = await db.query.items.findMany({
    orderBy: asc(items.id),
  });

  const modified = res.map((data) => {
    return {
      ...data,
      ItemName: `${
        itemsCache.find((item) => item.id === data.ItemID)?.Name ||
        "None"
      }`,
      QuestName: `${
        questsCache.find((quest) => quest.id === data.QuestID)?.Name ||
        "None"
      }`,
    };
  });

  return Response.json(modified);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await reqSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.quests_requirements.findFirst({
    where: eq(quests_requirements.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const questExist = await db.query.quests.findFirst({
    where: eq(quests.id, data.QuestID),
  });
  if (!questExist) errors.QuestID = "Quest ID does not exist";

  const itemExist = await db.query.items.findFirst({
    where: eq(items.id, data.ItemID),
  });
  if (!itemExist) errors.ItemID = "Item ID does not exist";

  const questConflict = await db.query.quests_requirements.findFirst({
    where: and(
      eq(quests_requirements.QuestID, data.QuestID),
      eq(quests_requirements.ItemID, data.ItemID)
    ),
  });

  if (questConflict) errors.QuestID = "Quest ID with item ID already exists";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(quests_requirements).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json("Failed to create " + error, { status: 400 });
  }
}
