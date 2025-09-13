"use client";

import BasePanel from "@/components/base-panel";
import {
  PanelInput,
  PanelSelect,
  PanelSwitch,
  PanelTextArea,
} from "@/components/panel-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { factionSchema } from "@/validations/panel/factionValidator";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { date } from "zod";

export default function Page() {
  const columns = [
    {
      accessorKey: "OwnerID",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            OwnerID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }: { row: any }) => {
        return (
          <>
            <span>{row.getValue("OwnerID")}</span>
            <Badge variant="secondary" className="ml-2">
              {row.original.Owner}
            </Badge>
          </>
        );
      },
    },
    {
      accessorKey: "BuyerID",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            BuyerID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }: { row: any }) => {
        return (
          <>
            <span>{row.getValue("BuyerID")}</span>
            <Badge variant="secondary" className="ml-2">
              {row.original.Buyer}
            </Badge>
          </>
        );
      },
    },
    {
      accessorKey: "ItemName",
      header: "Items",
    },
    {
      accessorKey: "Gold",
      header: "Gold",
    },
    {
      accessorKey: "Coins",
      header: "Coins",
    },
    {
      accessorKey: "Quantity",
      header: "Quantity",
    },
    {
      accessorKey: "Type",
      header: "Type",
      cell: ({ row }: { row: any }) => (
        <Badge variant="secondary" className="ml-2">
          {row.original.Type}
        </Badge>
      ),
    },
    {
      accessorKey: "Date",
      header: "Date",
    },
  ];

  return (
    <BasePanel
      entityName="Auction Logs"
      description="No Description"
      table=""
      searchName="OwnerID"
      apiEndpoint="/api/panel/logs/auction"
      columns={columns}
      viewOnly={true}
    />
  );
}
