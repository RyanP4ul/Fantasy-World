"use client";

import PanelLayout from "@/components/layout/panel-layout";
import TestBasePanel from "@/components/panel/test-base-panel";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import React from "react";

type Achievement = {
  id: number;
  Name: string;
  Description: string;
};

export default function Page() {
  const columns = React.useMemo<ColumnDef<Achievement>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-3 cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: "Image",
        header: "Image",
        cell: ({ row } : { row : any}) => (
          <img
            src={`/api/assets/game/achievements/${row.original.Image}`}
            alt="Achievement"
            width={60}
            height={60}
          />
        ),
      },
      {
        accessorKey: "Name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-3 cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: "Description",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-3 cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Description
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <TestBasePanel
      pageName="Achievements"
      url="/api/panel/achievements"
      columns={columns}
    />
  );
}
