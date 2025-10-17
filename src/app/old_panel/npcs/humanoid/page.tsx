"use client";

import BasePanel from "@/components/base-panel";
import {
  PanelColorPicker,
  PanelComboBox,
  PanelInput,
  PanelSelect,
  PanelSwitch,
  PanelTextArea,
} from "@/components/panel-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { humanoidSchema } from "@/validations/panel/npcValidator";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
      accessorKey: "NpcID",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            NpcID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <Link href={`/panel/npcs/?edit=${row.original?.NpcID}`}>
            <span className="mr-2">{row.original?.NpcID}</span>
            <Badge variant="secondary">{row.original?.Npc}</Badge>
          </Link>
        );
      },
    },  
    {
      accessorKey: "MapID",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            MapID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <Link href={`/panel/maps/?edit=${row.original?.MapID}`}>
            <span className="mr-2">{row.original?.MapID}</span>
            <Badge variant="secondary">{row.original?.Map}</Badge>
          </Link>
        );
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
        <div className="col-span-12 md:col-span-3">
          <PanelComboBox
            api="/api/panel/npcs"
            name="NpcID"
            label="Npc ID"
            form={form}
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <PanelInput
            control={form.control}
            name="Equipments"
            type="text"
            label="Equipments"
            placeholder="Equipments"
            description="Example: 1,2"
          />
        </div>
        <div className="col-span-12 md:col-span-2">
          <PanelSelect
            control={form.control}
            name="Gender"
            label="Gender"
            placeholder="Select"
          >
            <SelectItem value="M">Male</SelectItem>
            <SelectItem value="F">Female</SelectItem>
          </PanelSelect>
        </div>

        <div className="col-span-12 md:col-span-3">
          <PanelColorPicker
            name="ColorHair"
            label="Hair Color"
            control={form.control}
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelColorPicker
            name="ColorSkin"
            label="Skin Color"
            control={form.control}
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelColorPicker
            name="ColorEye"
            label="Eye Color"
            control={form.control}
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelColorPicker
            name="ColorBase"
            label="Base Color"
            control={form.control}
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelColorPicker
            name="ColorTrim"
            label="Trim Color"
            control={form.control}
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelColorPicker
            name="ColorAccessory"
            label="Accessory Color"
            control={form.control}
          />
        </div>
      </div>
    );
  };

  const defaultValues = {
    Name: "",
    TextGuild: "",
    TextNameColor: "#000000",
    TextGuildColor: "#000000",
  };

  return (
    <BasePanel
      entityName="Npcs Entity Humanoid"
      description="No Description"
      table="npcs_entity_humanoid"
      searchName="Npc"
      schema={humanoidSchema}
      apiEndpoint="/api/panel/npcs/humanoid"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
