import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";

export async function POST(req: Request) {
  // const contentType = req.headers.get("content-type") || "";

  // let data: any = {};
  // if (contentType.includes("application/json")) {
  //   data = await req.json();
  // } else if (contentType.includes("application/x-www-form-urlencoded")) {
  //   const formData = await req.formData();
  //   formData.forEach((v, k) => (data[k] = v));
  // }

  // console.log(data);

  // return Response.json({ ok: true, received: data });
  
  try {
    const ccid = req.headers.get("ccid");
    const token = req.headers.get("token");

    console.log(`ccid: ${ccid}, token: ${token}`);

    if (!ccid || !token) {
      return Response.json("404", { status: 404 });
    }

    // find user
    const user = await db.query.users.findFirst({
      where: eq(users.id, Number(ccid)),
    });

    if (!user || user.Hash != token) {
      return Response.json("Invalid Account");
    }

    const [userItemBanks] = await db.execute(
      sql`SELECT a.id CharItemID, a.UserID, a.ItemID, a.EnhID, a.Equipped, a.Quantity, a.Bank, a.DatePurchased, b.Name, b.Description, b.Range, b.DPS, b.Rarity, b.Cost, b.Level, b.Temporary, b.Stack, b.Upgrade, b.Coins, b.Staff, b.File, b.Link, b.Element, b.Type, b.Icon, b.Equipment FROM users_items AS a INNER JOIN items AS b ON a.ItemID = b.id WHERE UserID = ${ccid} AND Bank = 1`
    ) as any[];

    if (!userItemBanks) {
        return Response.json("No items found", { status: 404 });
    }

    const items = [];

    for (const userItemBank of userItemBanks) {
      items.push({
        CharItemID: userItemBank.CharItemID,
        CharID: userItemBank.UserID,
        iQty: userItemBank.Quantity,
        bEquip: userItemBank.Equipped == 1,
        bBank: userItemBank.Bank == 1,
        ItemID: userItemBank.ItemID,
        sName: userItemBank.Name,
        sDesc: userItemBank.Description,
        iRng: userItemBank.Range,
        iDPS: userItemBank.DPS,
        iRty: userItemBank.Rarity,
        iCost: userItemBank.Cost,
        iLvl: userItemBank.Level,
        bTemp: userItemBank.Temporary == 1,
        iStk: userItemBank.Stack,
        bUpg: userItemBank.Upgrade == 1,
        bCoins: userItemBank.Coins == 1,
        bStaff: userItemBank.Staff == 1,
        sFile: userItemBank.File,
        sLink: userItemBank.Link,
        sElmt: userItemBank.Element,
        sType: userItemBank.Type,
        sIcon: userItemBank.Icon,
        sES: userItemBank.Equipment,
        EnhID: userItemBank.EnhID,
        iHrs: 59100,

      });
    }

    return Response.json(items);
  } catch (error) {
    console.log(error);
    return Response.json("error" + error, { status: 500 });
  }
}
