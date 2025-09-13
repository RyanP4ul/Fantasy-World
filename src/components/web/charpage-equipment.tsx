import { usePagination } from "@/hooks/use-pagination";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { getRarity } from "@/lib/rarities";
import Pagination from "../pagination";

export default function CharacterEquipmentPagination({ data }: { data: any }) {

  const { currentItems, currentPage, totalPages, goToPage, getPageNumbers } = usePagination(data, 15);

  return (
    <>
      <div className="space-y-1">
        {currentItems?.map((item: any) => {
          return (
            <div key={item.Name} className="flex">
              <img
                className="w-6 h-6 mt-2 mr-2"
                src={`/assets/images/equipment/${item.Type}.png`}
                alt={item.Type}
              />
              <div className="flex flex-col">
                <Link className="inline" href={`/wiki/item/${item.Name}`}>
                  {item.Upgrade === 1 ? (
                    <span className="text-amber-300">{item.Name}</span>
                  ) : (
                    item.Name
                  )}
                  {item.Coins === 1 ? (
                    <Badge variant="secondary" className="ml-1">
                      Coins
                    </Badge>
                  ) : null}
                  {item.Trade === 0 ? (
                    <Badge variant="secondary" className="ml-1">
                      Non-tradeable
                    </Badge>
                  ) : null}
                </Link>
                <p className={`text-sm text-[${getRarity(Number(item.Rarity)).color}]`}>
                  {getRarity(Number(item.Rarity)).sName}
                </p>
              </div>
            </div>
          );
        })}
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
