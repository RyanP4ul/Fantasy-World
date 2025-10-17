import { db } from "@/db";
import { auras, auras_effects } from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { auraEffectSchema } from "@/validations/panel/auraEffectValidator";
import { stat } from "@/lib/utils";

export async function GET() {
  const res = await db.query.auras_effects.findMany({
    orderBy: desc(auras_effects.id),
  });

  const auraObj = await db.query.auras.findMany({ orderBy: asc(auras.id) });

  const modified = res.map((user) => {
    return {
      ...user,
      Aura: `${
        auraObj.find((aura) => aura.id === user.AuraID)?.Name || "None"
      }`,
    };
  });

  return Response.json(modified);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await auraEffectSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.auras_effects.findFirst({
    where: eq(auras_effects.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const auraIdConflict = await db.query.auras_effects.findFirst({
    where: and(
      eq(auras_effects.AuraID, data.AuraID),
      eq(auras_effects.Stat, data.Stat)
    ),
  });
  if (auraIdConflict) errors.AuraID = "Aura ID with stat already exists";

  if (Object.keys(errors).length > 0) return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(auras_effects).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    return Response.json("Failed to create", { status: 400 });
  }
}
