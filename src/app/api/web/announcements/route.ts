import { getWebAnnouncements } from "@/features/web/web_announcements";

export async function GET(req: Request) {
    return Response.json(await getWebAnnouncements());
}