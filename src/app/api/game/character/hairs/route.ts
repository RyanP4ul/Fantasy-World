import { db } from "@/db";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest
) {
    const hairs = await db.query.hairs.findMany({
      columns: { id: true, Name: true, File: true, Gender: true },
    });
    const hairMale = [];
    const hairFemale = [];

    for (const hair of hairs) {
        if (hair.Gender === "M") {
            hairMale.push(hair);
        } else {
            hairFemale.push(hair);
        }
    }

    return Response.json({ 
        hairs: {
            M: hairMale,
            F: hairFemale
        }
     });
}