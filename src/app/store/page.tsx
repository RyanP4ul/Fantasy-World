"use client";

import WebLayout from "@/components/layout/web-layout";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import StoreLists from "@/components/web/store/store-lists";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2Icon, Eye, Store } from "lucide-react";

export default function Page() {
  const { data, isFetching } = useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const res = await fetch("/api/stores");
      return res.json();
    },
  });

  return (
    <WebLayout>
      <div className="px-6 py-6 mt-50">
        <h1 className="text-3xl font-bold mb-8">Store</h1>

        <Alert className="mb-5">
          <CheckCircle2Icon />
          <AlertTitle>
            We currently accept <b>PayPal</b> only. If you'd like to use a
            different payment method, please reach out to the admin.
          </AlertTitle>
        </Alert>

        <div className="mb-6 flex items-center justify-between">
          <div className="text-gray-400">Showing {data?.length || 0} items</div>
        </div>
        {isFetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-90 w-full" />
            <Skeleton className="h-90 w-full" />
            <Skeleton className="h-90 w-full" />
            <Skeleton className="h-90 w-full" />
            <Skeleton className="h-90 w-full" />
            <Skeleton className="h-90 w-full" />
          </div>
        ) : (
          <StoreLists data={data} />
        )}
      </div>
    </WebLayout>
  );
}
