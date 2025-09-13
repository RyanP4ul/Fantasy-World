import { book_quests, quests } from './../../../../db/schema';
import { db } from "@/db";
import { book } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET(req: Request) {
  const OBadgeAdd = [];
  const HMBadgeAdd = [];
  const AchBadgeAdd = [];
  const QuestsArray = [];

  const bookOfLore = await db.select().from(book).orderBy(asc(book.id));

  for (const book of bookOfLore) {
    if (book.Type === null) continue;

    const data: any = {
      strFile: book.File,
      strName: book.Name,
      strLinkage: book.Linkage,
      sDesc: book.Description,
      strType: book.Type,
      bitHide: book.Hide,
    };

    if (book.Lock) data.sLock = book.Lock;
    if (book.Map) data.strMap = book.Map;
    if (book.Label) data.strLabel = book.Label;
    if (book.Shop) data.strShop = book.Shop;

    if (book.Field === "QS") {
      data.strField = book.Field;
      data.intIndex = book.Index;
      data.intValue = book.Value;
    } else if (book.Field === "ia0") {
      data.strField = book.Field;
      data.intValue = book.Value;
    }

    switch (book.Type) {
        case "OBadge":
            OBadgeAdd.push(data);
            break;
        case "HMBadge":
            HMBadgeAdd.push(data);
            break;
        case "AchBadge":
            AchBadgeAdd.push(data);
    }
  }

  const bookQuests = await db.select().from(book_quests).orderBy(asc(book_quests.id));

  for (const quest of bookQuests) {
    const questInfo: any = {
      intIndex: quest.Index,
      strName: quest.Name,
      strField: quest.Field,
      sLock: quest.Lock,
      strMap: quest.Map,
      bitHide: quest.Hide,
      intValue: quest.Value,
    };
    QuestsArray.push(questInfo);
  }

  return Response.json({OBadge: OBadgeAdd, HMBadge: HMBadgeAdd, AchBadge: AchBadgeAdd, quests: QuestsArray}, {
    status: 200,
  });
}
