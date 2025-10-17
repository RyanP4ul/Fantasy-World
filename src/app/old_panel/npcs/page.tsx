"use client";

import BasePanel from "@/components/base-panel";
import {
  PanelColorPicker,
  PanelInput,
  PanelSelect,
  PanelSwitch,
  PanelTextArea,
} from "@/components/panel-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { npcSchema } from "@/validations/panel/npcValidator";
import { ArrowUpDown } from "lucide-react";
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
      accessorKey: "Image",
      header: "Image",
      cell: ({ row }: { row: { original: any } }) => {
        return <img
              src="https://placehold.co/100x100"
              alt="Maintenance"
            />;
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
      accessorKey: "EntityType",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            EntityType
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
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
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Name"
            type="text"
            label="Name"
            placeholder="Name"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelColorPicker
            name="TextNameColor"
            label="Name Color"
            control={form.control}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="TextGuild"
            type="text"
            label="Guild"
            placeholder="Text Guild"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelColorPicker
            name="TextGuildColor"
            label="Guild Color"
            control={form.control}
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelSelect
            control={form.control}
            name="EntityType"
            label="EntityType"
            placeholder="Select"
          >
            <SelectItem value="Humanoid">Humanoid</SelectItem>
            <SelectItem value="Generic">Generic</SelectItem>
          </PanelSelect>
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
      entityName="Npcs"
      description="No Description"
      table="npcs"
      searchName="Name"
      schema={npcSchema}
      apiEndpoint="/api/panel/npcs"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
