import { getPasswordHashByCharId } from "@/features/characters/characters";
import { parseFlashUrlencoded } from "@/lib/parse";
import { compare } from "bcryptjs";

export async function POST(req: Request) {
    const data : { charId: number, pass : string } = await parseFlashUrlencoded(req);

    if (!data || !data.charId || !data.pass) {
        return Response.json({ sMsg: "Invalid data!", bSuccess: 0 });
    }

    const userChar = await getPasswordHashByCharId(data.charId);

    if (!userChar) {
        return Response.json({ sMsg: "Character not found!", bSuccess: 0 });
    }

    const isValidPassword = await compare(data.pass, userChar);
    
    if (!isValidPassword) {
        return Response.json({ sMsg: "Incorrect password!", bSuccess: 0 });
    }

    return Response.json({ sMsg: "Password changed successfully!", bSuccess: 1 });
}