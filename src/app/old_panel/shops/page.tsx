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
import { shopSchema } from "@/validations/panel/shopValidator";
import { ArrowUpDown } from "lucide-react";

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
    },
    {
      accessorKey: "Status",
      header: "Status",
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <>
            {row.original?.House && (
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-white mr-1">
                House
              </Badge>
            )}
            {row.original?.Upgrade && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-600 dark:text-white mr-1">
                Upgrade
              </Badge>
            )}
            {row.original?.Staff && (
              <Badge className="bg-red-100 text-red-800 dark:bg-red-600 dark:text-white mr-1">
                Staff
              </Badge>
            )}
            {row.original?.Limited && (
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-600 dark:text-white mr-1">
                Limited
              </Badge>
            )}
            {!row.original?.House &&
              !row.original?.Upgrade &&
              !row.original?.Staff &&
              !row.original?.Limited && (
                <Badge variant="outline">None</Badge>
              )}
          </>
        );
      },
      enableHiding: false,
    },
  ];

  const renderFormFields = (form: any) => {
    return (
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="id"
            type="number"
            label="Id"
            placeholder="Id"
          />
        </div>
        <div className="col-span-12 md:col-span-9">
          <PanelInput
            control={form.control}
            name="Name"
            type="text"
            label="Name"
            placeholder="Name"
          />
        </div>
    
        <div className="col-span-12 md:col-span-2">
          <PanelSwitch form={form} name="House" label="House" />
        </div>

        <div className="col-span-12 md:col-span-2">
          <PanelSwitch form={form} name="Upgrade" label="Upgrade" />
        </div>

        <div className="col-span-12 md:col-span-2">
          <PanelSwitch form={form} name="Staff" label="Staff" />
        </div>
        
        <div className="col-span-12 md:col-span-2">
          <PanelSwitch form={form} name="Limited" label="Limited" />
        </div>
      </div>
    );
  };

  const defaultValues = {
    id: 0,
    Name: "",
    House: false,
    Upgrade: false,
    Staff: false,
    Limited: false,
  };

  return (
    <BasePanel
      entityName="Shops"
      description="No Description"
      table="shops"
      searchName="Name"
      schema={shopSchema}
      apiEndpoint="/api/panel/shops"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
