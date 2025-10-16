import { db } from "@/db";
import { areas } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function setHasImage(
  id: number,
  hasImage: boolean
): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.update(areas).set({ has_image: hasImage }).where(eq(areas.id, id));
  });
}

export async function hasImage(id: number): Promise<boolean> {
  return await db.query.areas
    .findFirst({
      where: eq(areas.id, id),
      columns: { has_image: true },
    })
    .then((area) => area?.has_image ?? false);
}
