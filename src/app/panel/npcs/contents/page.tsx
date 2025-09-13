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
import { contentSchema } from "@/validations/panel/npcValidator";
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
          <Link href={`/panel/items/?edit=${row.original?.ItemID}`}>
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
            api="/api/panel/maps"
            name="MapID"
            label="Map ID"
            form={form}
          />
        </div>
        <div className="col-span-12 md:col-span-4">
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
            name="Category"
            type="text"
            label="Category"
            placeholder="Category"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <PanelInput
            control={form.control}
            name="Label"
            type="text"
            label="Label"
            placeholder="Label"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <PanelSelect
            control={form.control}
            name="Entry"
            label="Entry"
            placeholder="Select"
          >
            <SelectItem value="Left">Left</SelectItem>
            <SelectItem value="Right">Right</SelectItem>
            <SelectItem value="Center">Center</SelectItem>
          </PanelSelect>
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
    Name: "",
    TextGuild: "",
    TextNameColor: "#000000",
    TextGuildColor: "#000000",
    Label: "Main"
  };

  return (
    <BasePanel
      entityName="Npcs Contents"
      description="No Description"
      table="npcs_contents"
      searchName="Npc"
      schema={contentSchema}
      apiEndpoint="/api/panel/npcs/contents"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
