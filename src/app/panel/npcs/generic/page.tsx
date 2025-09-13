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
import { genericSchema } from "@/validations/panel/npcValidator";
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
      accessorKey: "File",
      header: "File",
    },
    {
      accessorKey: "Linkage",
      header: "Linkage",
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
            api="/api/panel/npcs"
            name="NpcID"
            label="Npc ID"
            form={form}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="File"
            type="text"
            label="File"
            placeholder="File"
            description="Example: npcs/Leght.swf"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Linkage"
            type="text"
            label="Linkage"
            placeholder="Linkage"
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
      entityName="Npcs Entity Generic"
      description="No Description"
      table="npcs_entity_generic"
      searchName="Npc"
      schema={genericSchema}
      apiEndpoint="/api/panel/npcs/generic"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
