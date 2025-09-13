import WebLayout from "@/components/layout/web-layout";
import StorePayPalSuccess from "@/components/store-paypal-success";
import { Suspense } from "react";

export default function Page() {

  return (
    <WebLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <StorePayPalSuccess />
      </Suspense>
    </WebLayout>
  );
}
