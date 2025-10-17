import { getCharAchievementById } from "@/features/achievements/achievements.repository";
import { parseFlashUrlencoded } from "@/lib/parse";

export async function POST(req: Request) {
  let data: any = await parseFlashUrlencoded(req);

  if (!data || !data.charId) {
    return Response.json({ sMsg: "Error!", bSuccess: 0 }, { status: 400 });
  }

  const charId = Number(data.charId) ?? -1;

  console.log("Fetching achievements for CharID:", charId);

  if (charId === -1) {
    return Response.json({ sMsg: "Invalid CharID!", bSuccess: 0 }, { status: 400 });
  }

  return Response.json(await getCharAchievementById(charId));
}
