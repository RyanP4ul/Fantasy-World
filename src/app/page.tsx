"use client";

import WebLayout from "@/components/layout/web-layout";
import { Skeleton } from "@/components/ui/skeleton";
import WebPosts from "@/components/web/web-posts";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Check, Download, Users } from "lucide-react";

export default function Home() {
  const { data, isFetching } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch("/api/web/posts");

      if (!res.ok) {
        throw new Error("Error fetching table data");
      }

      return res.json();
    },
  });

  return (
    <WebLayout>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6 px-6 py-6 mt-50">
        <div>
          <h2 className="text-2xl font-bold">Server Announcements</h2>
          <p className="text-muted-foreground mb-4">
            Stay updated with the latest news and updates
          </p>

          {isFetching ? (
            <>
              <Skeleton className="h-[300] w-full rounded-xl mb-2" />
              <Skeleton className="h-[300] w-full rounded-xl mb-2" />
            </>
          ) : (
            <WebPosts data={data || []} />
          )}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Server Information</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold">Getting Started</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Welcome to our Adventure Quest Worlds private server! Create your
              account and begin your epic adventure in the world of Lore.
            </p>

            <h3 className="font-semibold">Server Features</h3>
            <ul className="space-y-1 mb-4">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-green-500" /> Custom quests and
                storylines
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-green-500" /> Enhanced drop rates
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-green-500" /> Active community
                events
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-green-500" /> 24/7 server uptime
              </li>
            </ul>

            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-primary cursor-pointer hover:underline">
                <Link
                  href="https://discord.gg/BYKaV6rzZN"
                  className="flex items-center gap-2"
                >
                  <Users className="w-4 h-4" /> Join Discord Community
                </Link>
              </li>
              <li className="flex items-center gap-2 text-primary cursor-pointer hover:underline">
                <Download className="/launcher" /> Download Launcher
              </li>
              <li className="flex items-center gap-2 text-primary cursor-pointer hover:underline">
                <BookOpen className="w-4 h-4" /> Beginner&apos;s Guide
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </WebLayout>
  );
}
