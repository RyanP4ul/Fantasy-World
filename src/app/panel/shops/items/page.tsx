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
import { itemSchema } from "@/validations/panel/shopValidator";
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
      accessorKey: "ShopID",
      header: "ShopID",
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <Link href={`/panel/shops/?edit=${row.original?.ShopID}`}>
            {row.original?.ShopID}
            <Badge variant="secondary" className="ml-2">
              {row.original?.ShopName}
            </Badge>
          </Link>
        );
      },
    },
    {
      accessorKey: "ItemID",
      header: "ItemID",
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
      accessorKey: "QuantityRemain",
      header: "Quantity Remain",
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
          <PanelComboBox
            api="/api/panel/shops"
            name="ShopID"
            label="Shop ID"
            form={form}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
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
            name="QuantityRemain"
            type="number"
            label="QuantityRemain"
            placeholder="QuantityRemain"
          />
        </div>
      </div>
    );
  };

  const defaultValues = {
    id: 0,
    QuantityRemain: 1,
  };

  return (
    <BasePanel
      entityName="Shops Items"
      description="No Description"
      table="shops_items"
      searchName="Name"
      schema={itemSchema}
      apiEndpoint="/api/panel/shops/items"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
