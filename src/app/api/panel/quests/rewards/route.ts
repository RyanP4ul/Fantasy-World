import { db } from "@/db";
import { items, quests, quests_rewards } from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { rewardSchema } from "@/validations/panel/questValidator";

export async function GET() {
  const res = await db.query.quests_rewards.findMany({
    orderBy: desc(quests_rewards.id),
  });

  const questsCache = await db.query.quests.findMany({
    orderBy: asc(quests.id),
  });
  const itemsCache = await db.query.items.findMany({
    orderBy: asc(items.id),
  });

  const modified = res.map((data) => {
    return {
      ...data,
      ItemName: `${
        itemsCache.find((item) => item.id === data.ItemID)?.Name || "None"
      }`,
      QuestName: `${
        questsCache.find((quest) => quest.id === data.QuestID)?.Name || "None"
      }`,
    };
  });

  return Response.json(modified);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await rewardSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.quests_rewards.findFirst({
    where: eq(quests_rewards.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const questExist = await db.query.quests.findFirst({
    where: eq(quests.id, data.QuestID),
  });
  if (!questExist) errors.QuestID = "Quest ID already exists";

  const itemExist = await db.query.items.findFirst({
    where: eq(items.id, data.ItemID),
  });
  if (!itemExist) errors.ItemID = "Item ID already exists";

  const rewardConflict = await db.query.quests_rewards.findFirst({
    where: and(
      eq(quests_rewards.QuestID, data.QuestID),
      eq(quests_rewards.ItemID, data.ItemID)
    ),
  });
  if (rewardConflict) errors.ItemID = "Item ID with stat already exists";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(quests_rewards).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json("Failed to create " + error, { status: 400 });
  }
}
