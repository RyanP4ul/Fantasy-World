"use client";

import BasePanel from "@/components/base-panel";
import {
  PanelComboBox,
  PanelInput,
  PanelSelect,
  PanelSwitch,
  PanelTextArea,
} from "@/components/panel-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { wheelSchema } from "@/validations/panel/wheelSchema";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
      accessorKey: "ItemID",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ItemID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <Link href={`/panel/items/?edit=${row.original?.ItemID}`}>
            {row.original?.ItemID}
            <Badge variant="secondary" className="ml-2">
              {row.original?.ItemName}
            </Badge>
          </Link>
        );
      },
    },
    {
      accessorKey: "Chance",
      header: "Chance",
    },
    {
      accessorKey: "Quantity",
      header: "Quantity",
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
          <PanelComboBox
            api="/api/panel/items"
            name="ItemID"
            label="Item ID"
            form={form}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Chance"
            type="text"
            label="Chance"
            placeholder="Chance"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Quantity"
            type="number"
            label="Quantity"
            placeholder="Quantity"
          />
        </div>
      </div>
    );
  };

  const defaultValues = {
    Chance: "1.0",
    Quantity: 1,
  };

  return (
    <BasePanel
      entityName="Wheels"
      description="No Description"
      table="wheels"
      searchName="ItemID"
      schema={wheelSchema}
      apiEndpoint="/api/panel/wheels"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
