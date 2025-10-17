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

export default function Page() {
  const [color, setColor] = useState("#3498DB");

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
      accessorKey: "UserID",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            UserID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row } : { row: any }) => {
        return (
            <>
            <span>{row.getValue("UserID")}</span>
            <Badge variant="secondary" className="ml-2">
              {row.original.Username}
            </Badge>
            </>
        );
      },
    },
    {
      accessorKey: "Action",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Action
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "Description",
      header: "Description"
    },
    {
      accessorKey: "Date",
      header: "Date",
      cell: ({ row } : { row: any }) => {
        const date = new Date(row.getValue("Date"));
        return <span>{format(date, "yyyy-MM-dd")}</span>;
      },
    }
  ];

  return (
    <BasePanel
      entityName="Panel Logs"
      description="No Description"
      table="panel_logs"
      searchName="Username"
      apiEndpoint="/api/panel/logs"
      columns={columns}
      viewOnly={true}
    />
  );
}
