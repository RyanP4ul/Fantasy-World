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
import { ArrowUpDown, Edit, Eye } from "lucide-react";
import { redirect } from "next/navigation";
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
      accessorKey: "Name",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <div className="flex items-center gap-2">
            {row.original.Name}
            <img
              src={`https://flagcdn.com/16x12/${row.original.Country}.png`}
              alt={row.original.Country}
              className="h-4 w-6"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "Roles",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Roles
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <div className="flex flex-wrap gap-1">
            <div dangerouslySetInnerHTML={{ __html: row.original.Roles }} />
          </div>
        );
      },
    },
    {
      accessorKey: "View",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            View
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <div className="flex flex-wrap gap-1">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => redirect(`/panel/users/${row.original?.id}`)}
            >
              <Eye className="h-3 w-3" />
            </Button>
          </div>
        );
      },
    },
  ];

  const renderFormFields = (form: any) => {
    return (
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-5">
          <PanelInput
            control={form.control}
            name="id"
            type="number"
            label="Id"
            placeholder="Id"
          />
        </div>
        <div className="col-span-12 md:col-span-7">
          <PanelInput
            control={form.control}
            name="Name"
            type="text"
            label="Name"
            placeholder="Name"
          />
        </div>
      </div>
    );
  };

  const defaultValues = {
    Name: "",
  };

  return (
    <BasePanel
      entityName="Users"
      description="No Description"
      table="users"
      searchName="Name"
      schema={factionSchema}
      apiEndpoint="/api/panel/users"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
      viewOnly={true}
    />
  );
}
