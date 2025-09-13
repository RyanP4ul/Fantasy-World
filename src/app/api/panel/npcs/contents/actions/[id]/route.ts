import { db } from "@/db";
import { npcs_contents, npcs_contents_actions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { actionSchema } from "@/validations/panel/npcValidator";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    let data = await req.json();
    const errors: Record<string, string> = {};

    if ((await actionSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const old = await db.query.npcs_contents_actions.findFirst({
      where: eq(npcs_contents_actions.id, Number(data.oldId)),
    });

    if (!old) return Response.json("Old Record not found", { status: 404 });

    if (old.id !== data.id) {
      const idConflict = await db.query.npcs_contents_actions.findFirst({
        where: eq(npcs_contents_actions.id, data.id),
      });
      if (idConflict) errors.id = "Id already exists";
    }

    const contentExist = await db.query.npcs_contents.findFirst({
      where: eq(npcs_contents.id, data.ContentID),
    });
    if (!contentExist) errors.ContentID = "ContentID does not exist";

    
    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });
    
    if (data.TitleColor && String(data.TitleColor).startsWith("#")) {
      data.TitleColor = String(data.TitleColor).replace("#", "0x");
    }

    if (data.SubTitleColor && String(data.SubTitleColor).startsWith("#")) {
      data.SubTitleColor = String(data.SubTitleColor).replace("#", "0x");
    }

    await db
      .transaction(async (tx) => {
        await tx
          .update(npcs_contents_actions)
          .set(data)
          .where(eq(npcs_contents_actions.id, Number(id)));
      })
      .catch(() => {
        return Response.json("Error transaction", { status: 500 });
      });

    return Response.json("Updated successfully", { status: 200 });
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
    await db
      .transaction(async (tx) => {
        await tx
          .delete(npcs_contents_actions)
          .where(eq(npcs_contents_actions.id, Number(id)));
      })
      .catch(() => {
        return Response.json("Error transaction", { status: 500 });
      });

    return Response.json("Deleted successfully", { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json("Error deleting", { status: 403 });
    }
  }
}
