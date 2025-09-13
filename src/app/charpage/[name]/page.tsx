"use client";

import WebLayout from "@/components/layout/web-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DialogOverlay } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CharacterEquipmentPagination from "@/components/web/charpage-equipment";
import { usePagination } from "@/hooks/use-pagination";
import { getRarity } from "@/lib/rarities";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const GuildRank = (rank: number) => {
  switch (rank) {
    case 1:
      return "Member";
    case 2:
      return "Officer";
    case 3:
      return "Leader";
    default:
      return "Duffer";
  }
};

export default function Page() {
  const params = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["character", params.name],
    queryFn: () => {
      return fetch(`/api/characters/${params.name}`).then((res) => res.json());
    },
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!data) {
    return <h1>Character not found</h1>;
  }

  return (
    <WebLayout>
      <h2 className="text-2xl font-bold mb-5">{params.name}</h2>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-8">
          <div
            className="w-auto h-auto object-contain"
            style={{
              overflowY: "hidden",
              overflowX: "hidden",
              backgroundImage: "url('/assets/images/bg/default-bg.png')",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6 px-6 py-6">
              <div style={{ padding: "20px 5px 5px 100px" }}>
                <h1 className="text-white font-bold text-5xl text-uppercase [text-shadow:0_0_5px_#000,0_0_5px_#000,0_0_5px_#000]">
                  {data.user.Name}
                </h1>
                <h1 className="text-white font-semibold text-1xl text-uppercase mb-3 [text-shadow:0_0_5px_#000,0_0_10px_#000,0_0_20px_#000]">
                  Level {data.user.Level}
                  {Object.entries(data?.userItemEquipped)?.map(
                    ([slot, item]: any) => (
                      <div key={item.Name} className="flex-1">
                        {item?.Name ? (
                          <div className="flex">
                            <img
                              className="w-6 h-6 mr-2"
                              src={`/assets/images/equipment/${item.Type}.png`}
                              alt={item.Type}
                            />
                            <h4 className="text-white text-md [text-shadow:0_0_5px_#000,0_0_10px_#000,0_0_20px_#000]">
                              {item.Name}
                            </h4>
                          </div>
                        ) : (
                          <div className="flex">
                            <img
                              className="w-6 h-6 mr-2"
                              src={`/assets/images/equipment/${slot}.png`}
                              alt={slot}
                            />
                            <span className="text-gray-500">{item}</span>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </h1>
              </div>
              <div className="">
                <img
                  src={`/assets/images/characters/${data.user.Name}.png`}
                  alt="Alt"
                  className="scale-x-[-1]"
                />
              </div>
            </div>
          </div>
          <Tabs defaultValue="inventory" className="space-y-6 pt-5">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="badges">Achievements</TabsTrigger>
            </TabsList>
            <TabsContent value="inventory">
              <Card>
                <CardContent>
                  <CharacterEquipmentPagination data={data.userItems || []} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="badges">
              <div className="grid grid-cols-12 gap-4">
                {data.userAchievements?.length > 0 ? (
                  data.userAchievements.map((badge: any) => (
                    <div key={badge.Name} className="col-span-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <img
                            src={`/assets/images/achievements/${badge.Image}`}
                            alt={badge.Name}
                            width={100}
                            height={100}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-lg text-shadow-lg">
                            {badge.Description || ""}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  ))
                ) : (
                  <div className="col-span-12">
                    <p className="text-gray-500">No badges earned yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="col-span-12 md:col-span-4">
          <Card className="col-span-12 md:col-span-4">
            <div className="shadow-lg p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                  <img
                    alt="Character Avatar"
                    className="w-full h-full rounded-full object-cover"
                    src="/assets/images/default-avatar.jpg"
                  />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {data.user.Name}
                </h3>
                <p className="text-gray-400">Level {data.user.Level} Warrior</p>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Experience</span>
                    <span className="text-white">
                      {data.user.Level} / 3,000,000
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full"></div>
                  </div>
                </div>
                {/* <div className="border-t border-gray-700 pt-4">
                <h4 className="text-white font-medium mb-3">Statistics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">HP</span>
                    <span className="text-red-400">2,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">MP</span>
                    <span className="text-blue-400">890</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Attack</span>
                    <span className="text-yellow-400">1,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Defense</span>
                    <span className="text-green-400">1,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Critical</span>
                    <span className="text-purple-400">23%</span>
                  </div>
                </div>
              </div> */}
                {data?.guild && (
                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-white font-medium mb-3">Guild</h4>
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name</span>
                        <span className="text-white">
                          {data?.guild?.Name || "Unknown"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rank</span>
                        <span className="text-yellow-400">
                          {GuildRank(data.guild.Rank)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-white font-medium mb-3">Activity</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Login</span>
                      <span className="text-white">
                        {format(data.user.LastLogin, "MMM dd, yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Joined</span>
                      <span className="text-white">
                        {format(data.user.DateCreated, "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-white font-medium mb-3">Titles</h4>
                  <div className="inline">
                    {data.userTitles?.length > 0 ? (
                      data.userTitles.map((title : any) => (
                        <Badge
                          key={title.Name}
                          variant="secondary"
                          className="px-2 py-1 m-1"
                        >
                          {title.Name}
                        </Badge>
                      ))
                    ) : (
                      <div className="col-span-3 text-center text-gray-400">
                        No Titles Found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </WebLayout>
  );
}
