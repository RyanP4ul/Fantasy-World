"use client";

import BasePanel from "@/components/base-panel";
import {
  PanelComboBox,
  PanelInput,
  PanelSelect,
  PanelTextArea,
} from "@/components/panel-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { dropSchema } from "@/validations/panel/monsterValidator";
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
      accessorKey: "MonsterID",
      header: "MonsterID",
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <Link href={`/panel/monsters/?edit=${row.original?.MonsterID}`}>
            {row.original?.MonsterID}
            <Badge variant="secondary" className="ml-2">
              {row.original?.MonsterName}
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
    { accessorKey: "Chance", header: "Chance" },
    { accessorKey: "Quantity", header: "Quantity" },
  ];

  const renderFormFields = (form: any) => {
    return (
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-4">
          <PanelInput
            control={form.control}
            name="id"
            type="number"
            label="Id"
            placeholder="Id"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <PanelComboBox
            api="/api/panel/monsters"
            name="MonsterID"
            label="Monster ID"
            form={form}
          />
        </div>
        <div className="col-span-12 md:col-span-4">
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
      entityName="Monsters Drops"
      description="No Description"
      table="monsters_drops"
      searchName="MonsterID"
      schema={dropSchema}
      apiEndpoint="/api/panel/monsters/drops"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
