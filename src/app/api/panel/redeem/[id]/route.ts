import { db } from "@/db";
import { items, redeems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redeemSchema } from "@/validations/panel/redeemSchema";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    let data = await req.json();
    const errors: Record<string, string> = {};

    if ((await redeemSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const old = await db.query.redeems.findFirst({
      where: eq(redeems.id, Number(data.oldId)),
    });

    if (!old) return Response.json("Old Record not found", { status: 404 });

    if (old.id !== data.id) {
      const idConflict = await db.query.redeems.findFirst({
        where: eq(redeems.id, data.id),
      });
      if (idConflict) errors.id = "Id already exists";
    }

    if (old.Code != data.Code) {
        const codeConflict = await db.query.redeems.findFirst({
          where: eq(redeems.Code, data.Code),
        });
        if (codeConflict) errors.Code = "Code already exists";
    }

    // if (data.ReqClassID && old.ReqClassID != data.ReqClassID) {
    //     const reqClassItemExist = await db.query.items.findFirst({
    //       where: eq(items.id, data.ReqClassID),
    //     });
    //     if (!reqClassItemExist) errors.ReqClassID = "Class ID does not exist";
    // }


    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });

    await db
      .transaction(async (tx) => {
        await tx
          .update(redeems)
          .set(data)
          .where(eq(redeems.id, Number(id)));
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
          .delete(redeems)
          .where(eq(redeems.id, Number(id)));
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
