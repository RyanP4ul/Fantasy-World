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
import { getClassCategory } from "@/lib/utils";
import { classSchema } from "@/validations/panel/classValidator";
import { get } from "http";
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
            <span className="mr-2">{row.original?.ItemID}</span>
            <Badge variant="secondary">{row.original?.Name}</Badge>
          </Link>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "Category",
      header: "Category",
      cell: ({ row }: { row: { original: any } }) => {
        return getClassCategory(row.original?.Category);
      },
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
        {/* <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="ItemID"
            type="number"
            label="ItemID"
            placeholder="ItemID"
          />
        </div> */}

        <div className="col-span-12 md:col-span-6">
          <PanelComboBox api="/api/panel/items?equipment=ar" name="ItemID" label="Item ID" form={form} />
        </div>

        <div className="col-span-12 md:col-span-2">
          <PanelSelect
            control={form.control}
            name="Category"
            label="Category"
            placeholder="Select"
          >
            <SelectItem value="M1">Tank Melee</SelectItem>
            <SelectItem value="M2">Dodge Melee</SelectItem>
            <SelectItem value="M3">Full Hybrid</SelectItem>
            <SelectItem value="M4">Power Melee</SelectItem>
            <SelectItem value="S1">Luck Hybrid</SelectItem>
            <SelectItem value="C1">Offensive Caster</SelectItem>
            <SelectItem value="C2">Defensive Caster</SelectItem>
            <SelectItem value="C3">Power Caster</SelectItem>
          </PanelSelect>
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelTextArea
            control={form.control}
            name="Description"
            label="Description"
            placeholder="Description"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelTextArea
            control={form.control}
            name="ManaRegenerationMethods"
            label="ManaRegenerationMethods"
            placeholder="ManaRegenerationMethods"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelTextArea
            control={form.control}
            name="StatsDescription"
            label="StatsDescription"
            placeholder="StatsDescription"
          />
        </div>
      </div>
    );
  };

  const defaultValues = {};

  return (
    <BasePanel
      entityName="Classes"
      description="No Description"
      table="classes"
      searchName="ItemID"
      schema={classSchema}
      apiEndpoint="/api/panel/classes"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
