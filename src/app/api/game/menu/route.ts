import { getMenus, getGameMenu, getGameMenuNews } from "@/features/game_menu/game_menu";

export async function GET() {
    return Response.json(await getMenus());
}