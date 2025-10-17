// "use client";

// import PanelLayout from "@/components/layout/panel-layout";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
// import { getClassCategory } from "@/lib/utils";
// import { useQuery } from "@tanstack/react-query";
// import { ChartCandlestick, ScrollText, Sword, Swords } from "lucide-react";
// import { useState } from "react";

// export default function Page() {
//   const [selectedClass, setSelectedClass] = useState<any>(null);

//   const { data, isLoading, isFetched } = useQuery({
//     queryKey: ["classes"],
//     queryFn: async () => {
//       const res = await fetch("/api/panel/classes");
//       return res.json();
//     },
//   });

//   return (
//     <PanelLayout entityName="Class Builder">
//       <h2 className="text-2xl font-bold">Ranking</h2>
//       <p className="text-muted-foreground mb-4">Top players in the server</p>

//       <div className="grid grid-cols-12 gap-4">
//         <div className="col-span-12 md:col-span-3">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle className="text-lg font-medium">Classes</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {isFetched && (
//                   <>
//                     {data.map((item: any) => (
//                       <div
//                         key={item.id}
//                         className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer ${item.id == (selectedClass?.id || -1) ? "bg-muted/90" : ""}`}
//                         onClick={() => setSelectedClass(item)}
//                       >
//                         <Swords className="w-10 h-10" />
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-medium text-foreground truncate">
//                             {item.Name}
//                           </p>
//                           <p className="text-xs text-muted-foreground">{getClassCategory(item.Category)}</p>
//                         </div>
//                         <Badge variant="secondary" className="text-xs">
//                           {item.Category.indexOf("M") !== -1 ? "Physical" : "Magical"}
//                         </Badge>
//                       </div>
//                     ))}
//                   </>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//         <div className="col-span-12 md:col-span-9">
//           <Card className="p-4">
//             <CardContent>
//               {selectedClass == null ? (
//                 <div className="flex justify-center items-center h-full">
//                   <div className="text-center">
//                     {/* <i className="ri-focus-line text-6xl text-gray-300 mb-4"></i> */}
//                     {/* <ChartCandlestick className="text-6xl text-gray-300 mb-4" /> */}
//                     <h3 className="text-xl font-bold text-gray-500 mb-2">
//                       Select a Class
//                     </h3>
//                     <p className="text-gray-400">
//                       Choose a class from the list to view and edit its
//                       abilities and passives
//                     </p>
//                   </div>
//                 </div>
//               ) : (
//                 <></>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </PanelLayout>
//   );
// }

export default function Page() {
  return (
    <h1>Test</h1>
  );
}