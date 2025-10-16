import { getWebAnnouncementById } from "@/features/web/web_announcements";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  return Response.json(await getWebAnnouncementById(id));
}
