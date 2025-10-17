"use client";

import PanelLayout from "@/components/layout/panel-layout";
import { SectionCards } from "@/components/section-cards";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardAction,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconTrendingUp } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { fa } from "zod/v4/locales";
import { Activity, Crown, Skull, TrendingUp } from "lucide-react";
import Link from "next/link";
import { PanelVisitorsCharts } from "@/components/panel-visitors-charts";
import { format } from "date-fns";

export default function Page() {
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/panel/dashboard");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  return (
    <PanelLayout entityName="">
      <SectionCards data={data} />
      <PanelVisitorsCharts />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-card/50 backdrop-blur-sm border border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity Logs
            </CardTitle>
            <CardDescription>
              Latest moderator and admin actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.panel_logs.map((log: any) => (
                <div
                  key={log.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/20"
                >
                  {/* <div className={`w-2 h-2 rounded-full bg-info`} /> */}
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-foreground">
                        {log.Description}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {log.Action}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        by {log.User}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(log.Date), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Most Equipped Items
            </CardTitle>
            <CardDescription>Items used by the most players</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.mostEquippedItems.map(
                (
                  item: {
                    name: string;
                    type: string;
                    total_equipped: number;
                  },
                  index: number
                ) => {
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/20"
                    >
                      <img src="https://placehold.co/600x400" alt={item.name} className="w-20 h-20" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.type}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {item.total_equipped} users
                      </Badge>
                    </div>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Skull className="h-5 w-5" />
              World Bosses
            </CardTitle>
            <CardDescription>Status of World Bosses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.worldBosses.map(
                (
                  worldBoss: any,
                  index: number
                ) => {
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/20"
                    >
                      {/* <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-600 text-white">
                        {index + 1}
                      </div> */}
                      <img src="https://placehold.co/600x400" alt={worldBoss.Name} className="w-20 h-20" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {worldBoss.Name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {worldBoss.NextSpawn == "Spawned" ? <div className="text-green-500">{worldBoss.NextSpawn}</div> : <div className="text-red-600">{worldBoss.NextSpawn}</div>}
                        </p>
                      </div>
                      {/* <Badge variant="secondary" className="text-xs">
                        {worldBoss.total_equipped} users
                      </Badge> */}
                    </div>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  );
}
