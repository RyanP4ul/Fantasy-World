"use client";

import BasePanel from "@/components/base-panel";
import {
  PanelComboBox,
  PanelInput,
  PanelSelect,
} from "@/components/panel-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { requirementSchema } from "@/validations/panel/itemValidator";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";

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
      header: "ItemID",
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <Link href={`/panel/items/?edit=${row.original?.ItemID}`}>
            {row.original.ItemID}
            <Badge className="ml-2" variant="secondary">{row.original.ItemName}</Badge>
          </Link>
        );
      },
    },
    {
      accessorKey: "ReqItemID",
      header: "ReqItemID",
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <Link href={`/panel/items/?edit=${row.original?.ReqItemID}`}>
            {row.original.ReqItemID}
            <Badge className="ml-2" variant="secondary">{row.original.ReqItemName}</Badge>
          </Link>
        );
      },
    },
    { accessorKey: "Quantity", header: "Quantity" },
  ];

  const renderFormFields = (form: any) => {
    return (
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="id"
            type="number"
            label="Id"
            placeholder="Id"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelComboBox
            api="/api/panel/items"
            name="ItemID"
            label="ItemID"
            form={form}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelComboBox
            api="/api/panel/items"
            name="ReqItemID"
            label="ReqItemID"
            form={form}
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
    Quantity: 1,
  };

  return (
    <BasePanel
      entityName="Item Requirements"
      description="Item requirements define the necessary conditions for using or obtaining an item."
      table="items_requirements"
      searchName="ItemID"
      schema={requirementSchema}
      apiEndpoint="/api/panel/items/requirements"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
