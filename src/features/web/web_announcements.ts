import { db } from "@/db";

export async function getWebAnnouncements() {
    return db.query.web_announcements.findMany();
}

export async function getWebAnnouncementById(id: number) {
    return db.query.web_announcements.findFirst({
        where: (web_announcements, { eq }) => eq(web_announcements.id, id),
    });
}