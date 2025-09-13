"use client";

import BasePanel from "@/components/base-panel";
import {
  PanelComboBox,
  PanelInput,
  PanelSelect,
  PanelSwitch,
} from "@/components/panel-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { mapMonsterSchema } from "@/validations/panel/mapValidator";
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
      accessorKey: "MapID",
      header: "Map ID",
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
    {
      accessorKey: "MonsterID",
      header: "Monster ID",
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
    { accessorKey: "MonMapID", header: "Monster Map ID" },
    { accessorKey: "Frame", header: "Frame" },
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
            api="/api/panel/maps"
            name="MapID"
            label="Map ID"
            form={form}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelComboBox
            api="/api/panel/monsters"
            name="MonsterID"
            label="Monster ID"
            form={form}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="MonMapID"
            type="number"
            label="Monster Map ID"
            placeholder="Monster Map ID"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Frame"
            type="text"
            label="Frame"
            placeholder="Frame"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelSwitch form={form} name="Aggresive" label="Aggresive" />
        </div>
      </div>
    );
  };

  const defaultValues = {
    Frame: "Enter",
    Aggresive: false,
  };

  return (
    <BasePanel
      entityName="Maps Monsters"
      description="No description"
      table="maps_monsters"
      searchName="MapID"
      schema={mapMonsterSchema}
      apiEndpoint="/api/panel/maps/monsters"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
