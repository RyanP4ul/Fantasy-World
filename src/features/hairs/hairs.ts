import { db } from "@/db";

export async function getHairs() {
    return db.query.hairs.findMany();
}

export async function getHairById(id: number) {
    return db.query.hairs.findFirst({
        where: (hairs, { eq }) => eq(hairs.id, id),
    });
}