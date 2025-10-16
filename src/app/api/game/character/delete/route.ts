import { deleteChar } from "@/features/characters/characters";
import { parseFlashUrlencoded } from "@/lib/parse";
export async function POST(request: Request) {
  const data: { charId: number } = await parseFlashUrlencoded(request);

  if (!data || !data.charId) {
    return Response.json({ bSuccess: 0, sMsg: "Invalid request data" }, { status: 400 });
  }

  try {
    await deleteChar(data.charId);
    return Response.json({ bSuccess: 1, sMsg: "Character deleted successfully" }, { status: 200 });
  } catch (error) {
    return Response.json({ bSuccess: 0, sMsg: "Failed to delete character" }, { status: 500 });
  }
}
