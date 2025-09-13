"use client";

import WebLayout from "@/components/layout/web-layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { Info, Loader2Icon, RefreshCw, XCircle } from "lucide-react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function StorePayPalCancel() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);

  if (!token) {
    redirect("/store");
  }

  const { isFetching } = useQuery({
    queryKey: ["paypalOrder", token],
    queryFn: async () => {
      const res = await fetch(`/api/payment/paypal/cancel-order/${token}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error fetching order");
      return res.json();
    },
  });

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-6 mt-50">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <XCircle className="h-6 w-6 text-destructive" />
            <CardTitle>Payment Canceled</CardTitle>
          </div>
          <CardDescription>
            Your PayPal payment was canceled. No charges were made.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-destructive border-destructive/40"
            >
              CANCELED
            </Badge>
            {token ? (
              <span className="text-sm text-muted-foreground">
                Token:&nbsp;
                <code className="bg-muted px-1 py-0.5 rounded">{token}</code>
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">
                No token found in URL.
              </span>
            )}
          </div>

          <Separator />

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>What happened?</AlertTitle>
            <AlertDescription>
              You chose to cancel during the PayPal checkout flow. You can
              safely close this page or return to your cart to try again. If you
              believe this is an error, you can retry the payment below.
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-2 justify-between">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => redirect("/store")}
            disabled={isFetching}
          >
            {isFetching ? (
              <>
                <Loader2Icon className="animate-spin h-5 w-5 mr-2" />
                Loading...
              </>
            ) : (
              "Back to Store"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
