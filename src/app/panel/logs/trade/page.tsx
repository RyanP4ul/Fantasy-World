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
      accessorKey: "id",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "FromUserID",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            FromUserID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }: { row: any }) => {
        return (
          <>
            <span>{row.getValue("FromUserID")}</span>
            <Badge variant="secondary" className="ml-2">
              {row.original.From}
            </Badge>
          </>
        );
      },
    },
    {
      accessorKey: "ToUserID",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ToUserID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }: { row: any }) => {
        return (
          <>
            <span>{row.getValue("ToUserID")}</span>
            <Badge variant="secondary" className="ml-2">
              {row.original.To}
            </Badge>
          </>
        );
      },
    },
    {
      accessorKey: "Items",
      header: "Items",
      cell: ({ row }: { row: any }) => {
        return (
          <>
            {row.original.items.map((item: any) => (
              <Badge key={item.id} variant="secondary" className="mr-2">
                {item.Name}
              </Badge>
            ))}
          </>
        );
      },
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
      accessorKey: "Date",
      header: "Date",
    },
  ];

  return (
    <BasePanel
      entityName="Trade Logs"
      description="No Description"
      table=""
      searchName="FromUserID"
      apiEndpoint="/api/panel/logs/trade"
      columns={columns}
      viewOnly={true}
    />
  );
}
