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
import { ArrowUpDown } from "lucide-react";
import React from "react";
import { stat } from "@/lib/utils";
import { assignSchema } from "@/validations/panel/skillValidator";
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
      accessorKey: "SkillID",
      header: "SkillID",
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <Link href={`/panel/skills/?edit=${row.original?.SkillID}`}>
            {row.original?.SkillID}
            <Badge variant="secondary" className="ml-2">
              {row.original?.SkillName}
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
            api="/api/panel/skills"
            name="SkillID"
            label="Skill ID"
            form={form}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelComboBox
            api="/api/panel/items?equipment=ar"
            name="ItemID"
            label="Item ID"
            form={form}
          />
        </div>
      </div>
    );
  };

  const defaultValues = {};

  return (
    <BasePanel
      entityName="Skills Assign"
      description="No Description"
      table="skills_assign"
      searchName="ItemID"
      schema={assignSchema}
      apiEndpoint="/api/panel/skills/assign"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
