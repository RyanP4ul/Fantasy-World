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
import { getClassCategory } from "@/lib/utils";
import { patternSchema } from "@/validations/panel/enhancementSchema";
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
      accessorKey: "Desc",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Desc
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }: { row: { original: any } }) => {
        return getClassCategory(row.original?.Desc);
      },
    },
    {
      accessorKey: "Wisdom",
      header: "Wisdom",
    },
    {
      accessorKey: "Strength",
      header: "Strength",
    },
    {
      accessorKey: "Luck",
      header: "Luck",
    },
    {
      accessorKey: "Dexterity",
      header: "Dexterity",
    },
    {
      accessorKey: "Endurance",
      header: "Endurance",
    },
    {
      accessorKey: "Intelligence",
      header: "Intelligence",
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
        <div className="col-span-12 md:col-span-7">
          <PanelInput
            control={form.control}
            name="Name"
            type="text"
            label="Name"
            placeholder="Name"
          />
        </div>
        {/* <div className="col-span-12 md:col-span-2">
          <PanelInput
            control={form.control}
            name="Desc"
            type="text"
            label="Desc"
            placeholder="Desc"
          />
        </div> */}

        <div className="col-span-12 md:col-span-2">
          <PanelSelect
            control={form.control}
            name="Desc"
            label="Desc"
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
          <PanelInput
            control={form.control}
            name="Wisdom"
            type="number"
            label="Wisdom"
            placeholder="Wisdom"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Strength"
            type="number"
            label="Strength"
            placeholder="Strength"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Luck"
            type="number"
            label="Luck"
            placeholder="Luck"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Dexterity"
            type="number"
            label="Dexterity"
            placeholder="Dexterity"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Endurance"
            type="number"
            label="Endurance"
            placeholder="Endurance"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Intelligence"
            type="number"
            label="Intelligence"
            placeholder="Intelligence"
          />
        </div>
      </div>
    );
  };

  const defaultValues = {
    Wisdom: 0,
    Strength: 0,
    Luck: 0,
    Dexterity: 0,
    Endurance: 0,
    Intelligence: 0,
  };

  return (
    <BasePanel
      entityName="Enhancements Patterns"
      description="No Description"
      table="enhancements_patterns"
      searchName="Name"
      schema={patternSchema}
      apiEndpoint="/api/panel/enhancements/patterns"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
