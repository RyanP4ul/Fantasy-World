import WebLayout from "@/components/layout/web-layout";
import StorePayPalCancel from "@/components/store-paypal-cancel";
import { Suspense } from "react";

export default function Page() {
  return (
    <WebLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <StorePayPalCancel />
      </Suspense>
    </WebLayout>
  );
}