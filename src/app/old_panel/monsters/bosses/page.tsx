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
import { bossSchema } from "@/validations/panel/monsterValidator";
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
      accessorKey: "MapID",
      header: "MapID",
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <Link href={`/panel/maps/?edit=${row.original?.MapID}`}>
            {row.original?.MapID}
            <Badge variant="secondary" className="ml-2">
              {row.original?.MapName}
            </Badge>
          </Link>
        );
      },
    },
    { accessorKey: "SpawnInterval", header: "Spawn Interval" },
    { accessorKey: "TimeLimit", header: "TimeLimit" },
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
            api="/api/panel/maps"
            name="MapID"
            label="Map ID"
            form={form}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="SpawnInterval"
            type="number"
            label="SpawnInterval"
            placeholder="SpawnInterval"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="TimeLimit"
            type="number"
            label="TimeLimit"
            placeholder="TimeLimit"
          />
        </div>
        <div className="col-span-12 md:col-span-12">
          <PanelTextArea
            control={form.control}
            name="Description"
            label="Description"
            placeholder="Description"
          />
        </div>
      </div>
    );
  };

  const defaultValues = {
    TimeLimit: 5,
    Description: "",
  };

  return (
    <BasePanel
      entityName="Monsters Bosses"
      description="No Description"
      table="monsters_bosses"
      searchName="MonsterID"
      schema={bossSchema}
      apiEndpoint="/api/panel/monsters/bosses"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
