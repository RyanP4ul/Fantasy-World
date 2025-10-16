import { db } from "@/db";

export async function getGameMenu() {
  return db.query.game_menu.findMany();
}

export async function getGameMenuNews() {
  return db.query.game_menu_news.findMany();
}

export async function getMenus() {
  try {
    const gameMenuArr: Record<string, any> = {
      News: [],
      "Game Menu": [],
    };

    // --- NEWS ---
    const news = await getGameMenuNews();

    if (!news || news.length === 0) {
      throw new Error("Error 0");
    }

    for (const n of news) {
      try {
        const button1 = n.button_1?.split("|") ?? [];
        const button2 = n.button_2?.split("|") ?? [];

        gameMenuArr["News"].push({
          label: n.label,
          img: n.image,
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
    const gameMenus = await getGameMenu();

    if (!gameMenus || gameMenus.length === 0) {
      throw new Error("Error 1");
    }

    for (const gm of gameMenus) {
      try {
        const gameMenuObj: Record<string, any> = { text: gm.text };

        if (gm.action) gameMenuObj["strAction"] = gm.action;
        if (gm.action_id) gameMenuObj["intID"] = gm.action_id;
        if (gm.icon) gameMenuObj["ico"] = gm.icon;
        if (gm.style) gameMenuObj["style"] = gm.style;
        if (gm.frame) gameMenuObj["strFrame"] = gm.frame;
        if (gm.string_param) gameMenuObj["strString"] = gm.string_param;
        if (gm.pad) gameMenuObj["strPad"] = gm.pad;

        if (gm.subheader_text && gm.subheader_color) {
          gameMenuObj["subheader"] = {
            text: gm.subheader_text,
            color: gm.subheader_color,
          };
        }

        if (
          gm.alt_mode &&
          gm.alt_icon &&
          gm.alt_subheader_text &&
          gm.alt_subheader_color
        ) {
          gameMenuObj["altMode"] = gm.alt_mode;
          gameMenuObj["alt"] = {
            text: gm.alt_text,
            ico: gm.alt_icon,
            subheader: {
              text: gm.alt_subheader_text,
              color: gm.alt_subheader_color,
            },
          };
        }

        // --- MENU / SUBMENU HANDLING ---
        if (gm.action && gm.frame) {
          if (gm.action === "GotoAndPlay") {
            if (!gm.parent_frame) {
              // MENU
              if (!gameMenuArr[gm.frame]) gameMenuArr[gm.frame] = [];
            } else {
              // SUB MENU
              if (!gameMenuArr[gm.parent_frame])
                gameMenuArr[gm.parent_frame] = [];

              gameMenuArr[gm.parent_frame].push(gameMenuObj);
              continue;
            }
          } else if (gameMenuArr[gm.frame]) {
            gameMenuArr[gm.frame].push(gameMenuObj);
            continue;
          }
        }

        gameMenuArr["Game Menu"].push(gameMenuObj);
      } catch {
        console.log("Malformed game menu row");
        // skip malformed row
      }
    }

    return gameMenuArr
  } catch (err) {
    console.log(err);
    return { News: [], "Game Menu": [] };
  }
}
