import { createChar, CreateType, isExistCharName } from "@/features/characters/characters";
import { isExistUser } from "@/features/users/users";
import { parseFlashUrlencoded } from "@/lib/parse";
import { createSchema } from "@/validations/game/characterCreateValidator"

export async function POST(
    req : Request
) {
    const parse : any = await parseFlashUrlencoded(req);
    parse.color = JSON.parse(parse.color);

    let data : CreateType = parse;

    if (!data || !data.userId || !data.name || !data.gender || !data.hairId || !data.color || !data.items) {
        return Response.json({ sMsg: "Invalid data!", bSuccess: 0 });
    }

    console.log("Items:", data.items)

    const result = (await createSchema.safeParseAsync(data));

    if (!result.success) {
        console.error(result.error);
        for (const issue of result.error.issues) {
            return Response.json({ sMsg: issue.message, bSuccess: 0 });
        }
    }

    if (!isExistUser(data.userId)) {
        return Response.json({ sMsg: "User not found!", bSuccess: 0 });
    }

    if (await isExistCharName(data.name)) {
        return Response.json({ sMsg: "Character name already exists!", bSuccess: 0 });
    }

    try {
        await createChar(data);
        return Response.json({ sMsg: "Character created successfully!", bSuccess: 1 });
    } catch (error) {
        console.error(error);
        return Response.json({ sMsg: "Internal server error!", bSuccess: 0 });
    }
}