import {
  faChevronLeft,
  faChevronRight,
  faTools,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { usePagination } from "@/hooks/use-pagination";
import Pagination from "../pagination";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function WebPosts({ data }: { data: any }) {

  const { data: session } = useSession();
  const { currentItems, currentPage, totalPages, goToPage, getPageNumbers } = usePagination(data, 5);

  return (
    <>
      <div className="space-y-6">
        {currentItems.map((item: any, index: number) => (
          <Card key={index} className="mb-4 py-0">
            {item.image && (
              <img
                src={`/api/assets/web/announcements/${item.image}`}
                alt="PlaceHOlder"
                width={800}
                height={400}
                className="w-full h-auto rounded"
              />
            )}
            <CardHeader className={`${!item.image && "mt-5"}`}>
              <div className="flex items-center justify-between">
                <CardTitle>{item.title}</CardTitle>
                <Badge variant="secondary">{item.category}</Badge>
              </div>
              <CardDescription>
                By{" "}
                <Link href={`/charpage/${session?.user.name}`} className="font-medium">
                  {item.author}
                </Link>{" "}
                •{" "}
                {format(new Date(item.created_at), "MM/dd/yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent className="mb-5">{item.content}</CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
          getPageNumbers={getPageNumbers}
        />
      </div>
    </>
  );
}
