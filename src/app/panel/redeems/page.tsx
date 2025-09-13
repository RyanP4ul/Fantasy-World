"use client";

import BasePanel from "@/components/base-panel";
import {
  PanelComboBox,
  PanelDatePicker,
  PanelInput,
  PanelSelect,
  PanelSwitch,
  PanelTextArea,
} from "@/components/panel-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { redeemSchema } from "@/validations/panel/redeemSchema";
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
      accessorKey: "Code",
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
      accessorKey: "Quantity",
      header: "Quantity",
    },
    {
      accessorKey: "QuantityLeft",
      header: "QuantityLeft",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <>
            {row.original?.Limited && (
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-white mr-1">
                Limited
              </Badge>
            )}
            {row.original?.Expires && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-600 dark:text-white mr-1">
                Expires
              </Badge>
            )}
            {!row.original?.Limited && !row.original?.Expires && (
              <Badge variant="outline">Unlimited</Badge>
            )}
          </>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "DateExpiry",
      header: "DateExpiry",
    },
  ];

  const renderFormFields = (form: any) => {
    return (
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-2">
          <PanelInput
            control={form.control}
            name="id"
            type="number"
            label="Id"
            placeholder="Id"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Code"
            type="text"
            label="Code"
            placeholder="Code"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <div className="overflow-hidden pb-2">
            <PanelDatePicker
              form={form}
              name="DateExpiry"
              label="DateExpiry"
              placeholder="DateExpiry"
            />
          </div>
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelComboBox
            api="/api/panel/items"
            name="ItemID"
            label="Item ID"
            form={form}
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Gold"
            type="number"
            label="Gold"
            placeholder="Gold"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Coins"
            type="number"
            label="Coins"
            placeholder="Coins"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Exp"
            type="number"
            label="Exp"
            placeholder="Exp"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <PanelInput
            control={form.control}
            name="ClassPoints"
            type="number"
            label="Class Points"
            placeholder="Class Points"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <PanelInput
            control={form.control}
            name="Quantity"
            type="number"
            label="Quantity"
            placeholder="Quantity"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <PanelInput
            control={form.control}
            name="QuantityLeft"
            type="number"
            label="QuantityLeft"
            placeholder="QuantityLeft"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelSwitch form={form} name="Limited" label="Limited" />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelSwitch form={form} name="Expires" label="Expires" />
        </div>
      </div>
    );
  };

  const now = new Date();

  const defaultValues = {
    id: 0,
    Code: "",
    ItemID: 0,
    Gold: 0,
    Coins: 0,
    Exp: 0,
    ClassPoints: 0,
    Quantity: 1,
    QuantityLeft: 1,
    Limited: true,
    Expires: true,
  };

  return (
    <BasePanel
      entityName="Redeems"
      description="No Description"
      table="redeems"
      searchName="Code"
      schema={redeemSchema}
      apiEndpoint="/api/panel/redeem"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
