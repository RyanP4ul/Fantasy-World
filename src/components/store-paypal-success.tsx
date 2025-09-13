"use client";

import { useEffect, useState } from "react";
import { redirect, useSearchParams } from "next/navigation";
import WebLayout from "@/components/layout/web-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CheckCircle2,
  CheckCircle2Icon,
  ExternalLink,
  Loader2Icon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function StorePayPalSuccess() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    redirect("/store");
  }

  const testOrder = useQuery({
    queryKey: ["paypalOrder", token],
    queryFn: async () => {
      try {
        if (!token) {
          throw new Error("No order found.");
        }

        const res = await fetch("/api/payment/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) throw new Error("Error fetching PayPal Order");

        return await res.json();
      } catch (error) {
        console.error("Error in query function:", error);
      }
    },
    enabled: !!token,
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-2xl font-bold mb-4">Payment Result</h1>

      {testOrder.isFetching && (
        <div className="flex items-center justify-center gap-2">
          <Loader2Icon className="animate-spin h-5 w-5" />
          <p className="text-blue-500">Fetching payment status...</p>
        </div>
      )}

      {testOrder.isError && (
        <p className="text-red-500">{testOrder.error.message}</p>
      )}

      {!testOrder.isError && testOrder.isFetched && testOrder.data && (
        <Card>
          <div className="mx-auto max-w-4xl p-6 md:p-10">
            <div className="flex items-center justify-center gap-3">
              <CheckCircle2 className="h-7 w-7 shrink-0 text-green-600" />
              <div>
                <h1 className="text-2xl font-semibold leading-tight">
                  Payment successful
                </h1>
                <p className="text-sm text-muted-foreground">
                  Thanks, {testOrder.data.payer.name.given_name}{" "}
                  {testOrder.data.payer.name.surname}. Your order is now
                  confirmed.
                </p>
              </div>
            </div>

            <Card className="mt-6">
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    Order{" "}
                    <span className="font-mono text-base">
                      #{testOrder.data.id}
                    </span>
                    <Badge variant="secondary" className="ml-1">
                      {testOrder.data.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Please refresh your game client to updated inventory.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border p-4">
                    <div className="text-xs uppercase text-muted-foreground">
                      Payer
                    </div>
                    <div className="mt-1 font-medium">
                      {testOrder.data.payer.name.given_name}{" "}
                      {testOrder.data.payer.name.surname}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testOrder.data.payer.email_address}
                    </div>
                  </div>
                  <div className="rounded-2xl border p-4">
                    <div className="text-xs uppercase text-muted-foreground">
                      Payment
                    </div>
                    <div className="mt-2">
                      <a
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-sm font-medium underline-offset-4 hover:underline"
                        href={`https://www.paypal.com/myaccount/transactions/`}
                      >
                        View in PayPal <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Card>
      )}
    </div>
  );
}
