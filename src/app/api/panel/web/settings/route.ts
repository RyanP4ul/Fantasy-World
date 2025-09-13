import { boolean } from 'drizzle-orm/mysql-core';
import { db } from "@/db";
import { asc, desc, eq } from "drizzle-orm";

export async function GET() {
  const [webSettings] = (await db.execute(
    `SELECT * FROM settings_login WHERE location = "web"`
  )) as any[];

  const arrayString: Record<string, string | boolean> = {};

  for (const clientVar of webSettings) {
    arrayString[clientVar.name] = clientVar.value;
  }

  arrayString["CanRegister"] = arrayString["CanRegister"] === "1";
  arrayString["IsMaintenance"] = arrayString["IsMaintenance"] === "1";
  arrayString["IsStaffOnly"] = arrayString["IsStaffOnly"] === "1";

  return Response.json(arrayString);
}

export async function PUT(request: Request) {
  const body = await request.json();

  const entries = Object.entries(body);

  for (let [key, value] of entries) {
    await db.transaction(async (tx) => {
      if (key == "CanRegister" || key == "IsMaintenance" || key == "IsStaffOnly") {
        value = value == true ? "1" : "0";
      }

      await tx.execute(`UPDATE settings_login SET value = '${value}' WHERE location = "web" AND name = '${key}'`);
    });
  }

  return Response.json("Ok", { status: 200 });
}