import { db } from "@/db";
import { enhancements, enhancements_patterns } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { enhancementSchema } from "@/validations/panel/enhancementSchema";

export async function GET() {
  const res = await db.query.enhancements.findMany({
    orderBy: desc(enhancements.id),
  });

  const patternObj = await db.query.enhancements_patterns.findMany();

  const modified = res.map((enhancement) => {
    return {
      ...enhancement,
      PatternName: `${
        patternObj.find((p) => p.id === enhancement.PatternID)?.Name || "None"
      }`,
    };
  });

  return Response.json(modified);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await enhancementSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.enhancements.findFirst({
    where: eq(enhancements.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const nameConflict = await db.query.enhancements.findFirst({
    where: eq(enhancements.Name, data.Name),
  });
  if (nameConflict) errors.Name = "Name already exists";

  const patternExist = await db.query.enhancements_patterns.findFirst({
    where: eq(enhancements_patterns.id, data.PatternID),
  });
  if (!patternExist) errors.PatternID = "Pattern ID already exists";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(enhancements).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json("Failed to create " + error, { status: 400 });
  }
}
