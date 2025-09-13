export default function Page() {
  return (
    <h1>Test</h1>
  );
}

// "use client"

// import WebLayout from "@/components/layout/web-layout";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
//   CardDescription,
// } from "@/components/ui/card";
// import { IconArrowLeft } from "@tabler/icons-react";
// import { useQuery } from "@tanstack/react-query";
// import { Crown, ListTree, Loader2Icon } from "lucide-react";
// import { useSession } from "next-auth/react";
// import Link from "next/link";
// import React from "react";
// import { toast } from "sonner";

// export default async function Page({ params }: { params: { id: string } }) {
//     const { id } = params;
//   const { data: session } = useSession();

//   const handlePay = async () => {
//     if (!session) {
//       toast.error("You must be logged in to make a purchase");
//       return;
//     }

//     const res = await fetch("/api/payment/paypal/create-order", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         storeId: id || -1,
//         userId: session.user.id,
//       }),
//     });

//     if (!res.ok) {
//       toast.error("Error creating PayPal order");
//       return;
//     }

//     const data = await res.json();
//     const approveUrl = data.links.find(
//       (link: any) => link.rel === "approve"
//     )?.href;

//     if (approveUrl) {
//       window.location.href = approveUrl;
//     } else {
//       toast.error("Error creating PayPal order");
//     }
//   };

//   const { data, isLoading } = useQuery({
//     queryKey: ["store", params.id],
//     queryFn: async () => {
//       const res = await fetch(`/api/stores/${params.id}`);
//       return res.json();
//     },
//   });

//   return (
//     <WebLayout>
//       <div className="mx-auto max-w-3xl px-4 py-6 mt-50">
//         <Link href="/store" className="flex items-center py-5">
//           <IconArrowLeft className="mr-2 h-4 w-4" />
//           Back To Store
//         </Link>

//         {isLoading ? (
//           <div className="h-10 bg-background">
//             <div className="flex items-center justify-center">
//               <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
//               <p>Loading...</p>
//             </div>
//           </div>
//         ) : (
//           <>
//             <Card className="overflow-hidden rounded-2xl shadow-sm py-0">
//               <div className="relative aspect-[16/9] w-full overflow-hidden">
//                 <img
//                   src={`/assets/images/stores/${data.Images}`}
//                   alt={data.Image || "alt"}
//                   className="h-full w-full object-cover"
//                   loading="lazy"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
//               </div>

//               <CardHeader className="pb-2">
//                 <CardTitle className="text-base">
//                   <div className="flex items-start justify-between gap-2">
//                     <div>
//                       <div className="text-lg font-semibold leading-none">
//                         {data.Name}
//                       </div>
//                       <Badge variant="secondary" className="my-2">
//                         <Crown className="h-4 w-4" /> {data.Category}
//                       </Badge>
//                     </div>
//                     <div className="flex flex-wrap justify-end gap-1">
//                       <span className="text-3xl">$ {data.Price}</span>
//                     </div>
//                   </div>
//                 </CardTitle>
//                 <CardDescription>{data.Description}</CardDescription>
//               </CardHeader>

//               <CardContent className="space-y-3">
//                 <div className="space-y-3 text-left">
//                   {data.Gold > 0 && (
//                     <div className="flex justify-between">
//                       <span>Gold:</span>
//                       <span className="text-orange-300 font-medium">
//                         {data.Gold}
//                       </span>
//                     </div>
//                   )}
//                   {data.Coins > 0 && (
//                     <div className="flex justify-between">
//                       <span>Coins:</span>
//                       <span className="text-orange-500 font-medium">
//                         {data.Coins}
//                       </span>
//                     </div>
//                   )}

//                   {data.UpgradeDays > 0 && (
//                     <div className="flex justify-between">
//                       <span>Upgrade Days:</span>
//                       <span className="text-cyan-500 font-medium">
//                         {data.UpgradeDays} days
//                       </span>
//                     </div>
//                   )}

//                   {data.Title && data.Title !== "None" && (
//                     <div className="flex justify-between">
//                       <span>Title:</span>
//                       <span className="font-medium">{data.Title}</span>
//                     </div>
//                   )}
//                   {data.Achievement && data.Achievement !== "None" && (
//                     <div className="flex justify-between">
//                       <span>Achievement:</span>
//                       <span className="font-medium">{data.Achievement}</span>
//                     </div>
//                   )}
//                 </div>

//                 {data.items && data.items.length > 0 && (
//                   <div>
//                     <div className="mb-2 flex items-center gap-2 text-sm font-medium">
//                       <ListTree className="h-4 w-4" /> Items
//                     </div>
//                     <div className="rounded-lg border p-2">
//                       <ul>
//                         {data.items.map((it: any, idx: number) => (
//                           <Link href={`/wiki/item/${it.id}`}>
//                             <li
//                               key={idx}
//                               className="flex items-center justify-between rounded-md bg-muted/40 px-2 py-1"
//                             >
//                               <span className="flex items-center gap-1">
//                                 {it.Name}
//                               </span>
//                               <span className="text-muted-foreground">
//                                 x{it.Quantity || 0}
//                               </span>
//                             </li>
//                           </Link>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>

//               <CardFooter className="flex items-center justify-end gap-2 mb-5">
//                 <Button
//                   className="cursor-pointer"
//                   variant="default"
//                   size="lg"
//                   onClick={() => handlePay()}
//                   disabled={isLoading}
//                 >
//                   Buy Now
//                 </Button>
//               </CardFooter>
//             </Card>
//           </>
//         )}
//       </div>
//     </WebLayout>
//   );
// }
