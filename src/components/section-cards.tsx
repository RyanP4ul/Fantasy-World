import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  faBaseballBatBall,
  faEye,
  faHeartPulse,
  faLink,
  faMap,
  faPlus,
  faQuestion,
  faRegistered,
  faShop,
  faSkull,
  faStar,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { TrendingUp } from "lucide-react";

export const StatCard = ({
  link,
  title,
  value,
  icon,
  description,
  change,
}: any) => (
  <Card className="@container/card">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <FontAwesomeIcon
        icon={icon as IconProp}
        className="h-4 w-4 text-muted-foreground"
      />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">
        {!link || link == "#" ? (
          <>{value !== undefined ? value : <Skeleton className="h-8 w-10" />}</>
        ) : (
          <Link href={link || ""} className="hover:underline">
            {value !== undefined ? value : <Skeleton className="h-8 w-10" />}
          </Link>
        )}
      </div>
      {change && (
        <p className="text-xs text-success flex items-center mt-1">
          <TrendingUp className="h-3 w-3 mr-1" />+{change} added this day
        </p>
      )}
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </CardContent>
  </Card>
);

export function SectionCards({ data }: any) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-6">
      <StatCard
        link="#"
        title="Total Registered Users"
        value={data?.users}
        icon={faPlus}
        description="Total Registered Users"
      />
      <StatCard
        link="#"
        title="Total Registered Today"
        value={data?.registeredToday}
        icon={faRegistered}
        description="Total Registered Today"
      />
      <StatCard
        link="#"
        title="Peak Today"
        value={data?.peakPlayerToday}
        icon={faEye}
        description="Peak Users Today"
      />
      <StatCard
        link="/panel/achievements"
        title="Total Achievements"
        value={data?.achievements || 0}
        icon={faStar}
        description="Achievements in database"
      />
      <StatCard
        link="/panel/auras"
        title="Total Auras"
        value={data?.auras}
        icon={faSun}
        description="Auras in database"
      />
      <StatCard
        link="/panel/classes"
        title="Total Classes"
        value={data?.classes}
        icon={faLink}
        description="Classes in database"
      />
      <StatCard
        link="/panel/enhancements"
        title="Total Enhancements"
        value={data?.enhancements}
        icon={faHeartPulse}
        description="Enhancements in database"
      />
      <StatCard
        link="/panel/items"
        title="Total Items"
        value={data?.items}
        icon={faBaseballBatBall}
        description="Items in database"
      />
      <StatCard
        link="/panel/maps"
        title="Total Maps"
        value={data?.maps}
        icon={faMap}
        description="Maps in database"
      />
      <StatCard
        link="/panel/monsters"
        title="Total Monsters"
        value={data?.monsters}
        icon={faSkull}
        description="Monsters in database"
      />
      <StatCard
        link="/panel/quests"
        title="Total Quests"
        value={data?.quests}
        icon={faQuestion}
        description="Quests in database"
      />
      <StatCard
        link="/panel/shops"
        title="Total Shops"
        value={data?.shops}
        icon={faShop}
        description="Shops in database"
      />
    </div>
  );
}
