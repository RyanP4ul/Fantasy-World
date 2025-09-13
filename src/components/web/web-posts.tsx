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
            {item.Image && (
              <img
                src={`/api/assets/images/posts/${item.Image}`}
                alt="PlaceHOlder"
                width={800}
                height={400}
                className="w-full h-auto rounded"
              />
            )}
            <CardHeader className={`${!item.Image && "mt-5"}`}>
              <div className="flex items-center justify-between">
                <CardTitle>{item.Title}</CardTitle>
                <Badge variant="secondary">{item.Category}</Badge>
              </div>
              <CardDescription>
                By{" "}
                <Link href={`/charpage/${session?.user.Name}`} className="font-medium">
                  {item.Author}
                </Link>{" "}
                •{" "}
                {format(new Date(item.CreatedDate), "MM/dd/yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent className="mb-5">{item.Content}</CardContent>
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
