import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export function getUsers() {
  return db.query.users.findMany();
}

export function getUserById(id: number) {
  return db.query.users.findFirst({
    where: eq(users.id, id),
  });
}

export async function isExistUser(id: number): Promise<boolean> {
  const user = await db.query.users.findFirst({
    columns: { id: true },
    where: eq(users.id, id),
  });

  return !!user;
}
