"use client";

import WebLayout from "@/components/layout/web-layout";
import LoginForm from "@/components/login-form";
import { Suspense } from "react";

export default function Page() {
  
  return (
    <WebLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </WebLayout>
  );
}
