import { db } from "@/db";
import { users_stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token } = await req.json();

  const userStore = await db.query.users_stores.findFirst({
    where: eq(users_stores.Token, token),
  });

  if (!userStore || userStore.Status != "Pending") return Response.json({ error: "Invalid!" }, { status: 404 });

  const res = await fetch(
    `https://api-m.sandbox.paypal.com/v2/checkout/orders/${token}/capture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Error capturing PayPal order" + (await res.text()) },
      { status: 500 }
    );
  }

  try {
    await db
      .transaction(async (tx) => {
        await tx
          .update(users_stores)
          .set({ Status: "Success" })
          .where(eq(users_stores.Token, token));
      })
      .catch((error) => {
        return Response.json({ error: "Transaction failed" }, { status: 500 });
      });
  } catch (error) {
    console.error("Error capturing PayPal order:", error);
  }

  const data = await res.json();
  return NextResponse.json(data);
}
