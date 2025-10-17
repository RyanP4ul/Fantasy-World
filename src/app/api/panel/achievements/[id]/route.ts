import { db } from "@/db";
import { achievements } from "@/db/schema";
import { eq } from "drizzle-orm";
import { achievementSchema } from "@/validations/panel/achievementSchema";
import {
  getAchievementById,
  doesAchievementExist,
  updateAchievement,
  deleteAchievement,
} from "@/features/achievements/achievements.repository";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    let data = await req.json();
    const errors: Record<string, string> = {};

    if ((await achievementSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const old = await getAchievementById(Number(data.oldId), {
      id: true,
      Name: true,
    });

    if (!old) {
      return Response.json("Old Record not found", { status: 404 });
    }

    if (old.id !== data.id && await doesAchievementExist(eq(achievements.id, Number(data.id)))) {
      errors.id = "Id already exists";
    }

    if (old.Name != data.Name && await doesAchievementExist(eq(achievements.Name, data.Name))) {
      errors.Name = "Name already exists";
    }

    if (Object.keys(errors).length > 0) {
      return Response.json({ errors }, { status: 400 });
    }

    try {
      // return Response.json("Test", { status: 500 });

      if (!await updateAchievement(id, data)) {
        return Response.json("No record found to update", { status: 500 });
      }

      return Response.json("Updated successfully", { status: 200 });
    } catch (error) {
      return Response.json("Error validating uniqueness", { status: 500 });
    }

    // await db
    //   .transaction(async (tx) => {
    //     await tx
    //       .update(achievements)
    //       .set(data)
    //       .where(eq(achievements.id, Number(id)));
    //   })
    //   .catch(() => {
    //     return Response.json("Error transaction", { status: 500 });
    //   });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json("Error updating", { status: 403 });
    }
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    if (!(await deleteAchievement(id))) {
      return Response.json("No record found to delete", { status: 500 });
    }

    return Response.json("Deleted successfully " + id, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json("Error deleting", { status: 403 });
    }
  }
}
