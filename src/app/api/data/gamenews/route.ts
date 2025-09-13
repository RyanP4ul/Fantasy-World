import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";

export async function GET() {
  try {
    const gameMenuArr: Record<string, any> = {
      News: [],
      "Game Menu": [],
    };

    // --- NEWS ---
    const [news] = await db.execute(sql`SELECT * FROM game_menu_news`) as any[];

    if (!news || news.length === 0) {
      return NextResponse.json({ msg: "Error 0" }, { status: 403 });
    }

    for (const n of news) {
      try {
        const button1 = n.Button1?.split("|") ?? [];
        const button2 = n.Button2?.split("|") ?? [];

        gameMenuArr["News"].push({
          label: n.Label,
          img: n.Image,
          button1: {
            label: button1[0] ?? "",
            strAction: button1[1] ?? "",
            strString: button1[2] ?? "",
          },
          button2: {
            label: button2[0] ?? "",
            strAction: button2[1] ?? "",
            strString: button2[2] ?? "",
          },
        });
      } catch {
        // skip malformed
      }
    }

    // --- GAME MENU ---
    const [gameMenus] = await db.execute(sql`SELECT * FROM game_menu`) as any[];

    if (!gameMenus || gameMenus.length === 0) {
      return NextResponse.json({ msg: "Error 1" }, { status: 403 });
    }

    for (const gm of gameMenus) {
      try {
        const gameMenuObj: Record<string, any> = { text: gm.Text };

        if (gm.Action) gameMenuObj["strAction"] = gm.Action;
        if (gm.ActID) gameMenuObj["intID"] = gm.ActID;
        if (gm.Icon) gameMenuObj["ico"] = gm.Icon;
        if (gm.Style) gameMenuObj["style"] = gm.Style;
        if (gm.Frame) gameMenuObj["strFrame"] = gm.Frame;
        if (gm.String) gameMenuObj["strString"] = gm.String;
        if (gm.Pad) gameMenuObj["strPad"] = gm.Pad;

        if (gm.SubHeaderText && gm.SubHeaderColor) {
          gameMenuObj["subheader"] = {
            text: gm.SubHeaderText,
            color: gm.SubHeaderColor,
          };
        }

        if (
          gm.AltMode &&
          gm.AltIcon &&
          gm.AltSubHeaderText &&
          gm.AltSubHeaderColor
        ) {
          gameMenuObj["altMode"] = gm.AltMode;
          gameMenuObj["alt"] = {
            text: gm.AltText,
            ico: gm.AltIcon,
            subheader: {
              text: gm.AltSubHeaderText,
              color: gm.AltSubHeaderColor,
            },
          };
        }

        // --- MENU / SUBMENU HANDLING ---
        if (gm.Action && gm.Frame) {
          if (gm.Action === "GotoAndPlay") {
            if (!gm.ParentFrame) {
              // MENU
              if (!gameMenuArr[gm.Frame]) gameMenuArr[gm.Frame] = [];
            } else {
              // SUB MENU
              if (!gameMenuArr[gm.ParentFrame])
                gameMenuArr[gm.ParentFrame] = [];

              gameMenuArr[gm.ParentFrame].push(gameMenuObj);
              continue;
            }
          } else if (gameMenuArr[gm.Frame]) {
            gameMenuArr[gm.Frame].push(gameMenuObj);
            continue;
          }
        }

        gameMenuArr["Game Menu"].push(gameMenuObj);
      } catch {
        // skip malformed row
      }
    }

    return NextResponse.json(gameMenuArr);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
