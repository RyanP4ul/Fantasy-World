"use client";

import BasePanel from "@/components/base-panel";
import { PanelInput, PanelSelect } from "@/components/panel-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { auraSchema } from "@/validations/panel/auraValidator";
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
    { accessorKey: "Duration", header: "Duration" },
    { accessorKey: "Speed", header: "Speed" },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }: { row: { original: any } }) => {
        return <Badge variant="secondary">{row.original?.Category}</Badge>;
      },
      enableHiding: false,
    },
    {
      accessorKey: "target",
      header: "Target",
      cell: ({ row }: { row: { original: any } }) => {
        switch (row.original?.Target) {
          case "h":
            return "Hostile";
          case "s":
            return "Self";
          case "f":
            return "Friendly";
          default:
            return "Unknown";
        }
      },
      enableHiding: false,
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
          <PanelInput
            control={form.control}
            name="Name"
            type="text"
            label="Name"
            placeholder="Name"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Duration"
            type="number"
            label="Duration"
            placeholder="Duration"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Speed"
            type="number"
            label="Speed"
            placeholder="Speed"
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
            name="MaxStack"
            type="number"
            label="Max Stack"
            placeholder="Max Stack"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="CriticalHits"
            type="number"
            label="Critical Hits"
            placeholder="Critical Hits"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelSelect
            control={form.control}
            name="Category"
            label="Category"
            placeholder="Select"
          >
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="stun">Stun</SelectItem>
            <SelectItem value="freeze">Freeze</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
            <SelectItem value="stone">Stone</SelectItem>
            <SelectItem value="d">DoT</SelectItem>
          </PanelSelect>
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelSelect
            control={form.control}
            name="Target"
            label="Target"
            placeholder="Select"
          >
            <SelectItem value="h">Hostile</SelectItem>
            <SelectItem value="s">Self</SelectItem>
            <SelectItem value="f">Friendly</SelectItem>
          </PanelSelect>
        </div>
      </div>
    );
  };

  const defaultValues = {
    id: 0,
    Duration: 6,
    Speed: 2,
    Chance: 1.0,
    Target: "h",
    MaxStack: 999,
    CriticalHits: 0,
  };

  return (
    <BasePanel
      entityName="Aura"
      description="Auras are status effects that can boost or weaken a player or monster, like buffs or debuffs."
      table="auras"
      searchName="Name"
      schema={auraSchema}
      apiEndpoint="/api/panel/auras"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
