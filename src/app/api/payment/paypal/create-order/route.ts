import { db } from "@/db";
import { stores, users, users_stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const { storeId, userId } = await req.json();

  const _store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
  });

  if (!_store)
    return NextResponse.json({ error: "Store not found" }, { status: 404 });

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const PUBLIC_LINK = process.env.NEXT_PUBLIC_API_URL || "";
  const PAYPAL_LINK = process.env.PAYPAL_LINK || "";
  const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "";
  const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || "";
  const RETURN_URL = `${PUBLIC_LINK}/store/paypal/success`;
  const CANCEL_URL = `${PUBLIC_LINK}/store/paypal/cancel`;

  const total = parseFloat(_store.Price);

  const res = await fetch(
    `${PAYPAL_LINK}/v2/checkout/orders`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: total,
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: total,
                },
              },
            }
          },
        ],
        application_context: {
          return_url: RETURN_URL,
          cancel_url: CANCEL_URL,
        },
      }),
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Error creating PayPal Order" },
      { status: 500 }
    );
  }

  const data = await res.json();

  await db
    .transaction(async (tx) => {
      await tx.insert(users_stores).values({
        UserID: userId,
        StoreID: storeId,
        Status: "Pending",
        Token: String(data.id),
      } as any);
    })
    .catch((err) => {
      return NextResponse.json(
        { error: "Error creating transaction" },
        { status: 500 }
      );
    });

  return NextResponse.json(data);
}
