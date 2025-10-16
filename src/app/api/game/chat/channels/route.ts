import { db } from "@/db";

export async function GET(req: Request) {
    const channels = await db.query.chat_channels.findMany({});
    return Response.json({ channels });
}