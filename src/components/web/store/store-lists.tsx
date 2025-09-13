import Pagination from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { usePagination } from "@/hooks/use-pagination";
import { Eye, Lock, ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function StoreLists({ data }: { data: any }) {
  const { data: session } = useSession();
  const { currentItems, currentPage, totalPages, goToPage, getPageNumbers } =
    usePagination(data, 9);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((item: any) => (
          <Card className="py-0">
            <div className="relative">
              <img
                src={`/assets/images/stores/${item.Images}`}
                alt="PlaceHOlder"
                width={400}
                height={155}
                className="w-full h-48 rounded-t-lg object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />

              {item.Category !== "None" && (
                <Badge className="absolute top-2 right-2 bg-yellow-400 text-black">
                  {item.Category}
                </Badge>
              )}
            </div>

            <CardContent className="">
              <h2 className="text-lg font-semibold">{item.Name}</h2>
              <p className="text-sm text-gray-400">
                {item?.Description
                  ? item.Description.length > 50
                    ? String(item.Description).slice(0, 50) + "..."
                    : item.Description
                  : "No description available"}
              </p>
            </CardContent>

            <CardFooter className="flex items-center justify-between p-4">
              <div className="flex items-center gap-1 text-yellow-400 font-semibold">
                <span>$</span> {item.Price}
              </div>

              {session ? (
                // <Link href={`/store/${item.id}`}>
                <Link href={`#${item.id}`}>
                  <Button variant="outline" className="cursor-pointer">
                    Buy Now
                    <ShoppingCart className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" className="cursor-pointer" disabled>
                  Required Login
                  <Lock className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardFooter>
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
