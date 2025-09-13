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
import { actionSchema } from "@/validations/panel/npcValidator";
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
      accessorKey: "ContentID",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ContentID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <Link href={`/panel/npcs/contents/?edit=${row.original?.ContentID}`}>
            <span className="mr-2">{row.original?.ContentID}</span>
            <Badge variant="secondary">{row.original?.Category}</Badge>
          </Link>
        );
      },
    },
    {
      accessorKey: "Title",
      header: "Title"
    },
    {
      accessorKey: "Position",
      header: "Position",
      cell: ({ row }: { row: { original: any } }) => (<Badge variant="secondary">{row.original?.Position}</Badge>),
    }
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
        <div className="col-span-12 md:col-span-5">
          <PanelComboBox
            api="/api/panel/npcs/contents"
            name="ContentID"
            label="Content ID"
            form={form}
            sub="Category"
          />
        </div>
        <div className="col-span-12 md:col-span-2">
          <PanelSelect
            control={form.control}
            name="Position"
            label="Position"
            placeholder="Select"
          >
            <SelectItem value="Auto">Auto</SelectItem>
            <SelectItem value="Center">Center</SelectItem>
          </PanelSelect>
        </div>
        <div className="col-span-12 md:col-span-2">
          <PanelSelect
            control={form.control}
            name="Action"
            label="Action"
            placeholder="Select"
          >
            <SelectItem value="Goto">Goto</SelectItem>
            <SelectItem value="Shop">Shop</SelectItem>
            <SelectItem value="Map">Map</SelectItem>
            <SelectItem value="Quest">Quest</SelectItem>
            <SelectItem value="Link">Link</SelectItem>
            <SelectItem value="Move">Move</SelectItem>
          </PanelSelect>
        </div>
        <div className="col-span-12 md:col-span-8">
          <PanelInput
            control={form.control}
            name="Title"
            type="text"
            label="Title"
            placeholder="Title"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <PanelColorPicker
            control={form.control}
            name="TitleColor"
            label="Title Color"
          />
        </div>
        <div className="col-span-12 md:col-span-8">
          <PanelInput
            control={form.control}
            name="SubTitle"
            type="text"
            label="Sub Title"
            placeholder="Sub Title"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <PanelColorPicker
            control={form.control}
            name="SubTitleColor"
            label="Sub Title Color"
          />
        </div>
        
        <div className="col-span-12 md:col-span-4">
          <PanelInput
            control={form.control}
            name="Icon"
            type="text"
            label="Icon"
            placeholder="Icon"
          />
        </div>
        
        <div className="col-span-12 md:col-span-4">
          <PanelInput
            control={form.control}
            name="Value"
            type="text"
            label="Value"
            placeholder="Value"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <PanelInput
            control={form.control}
            name="MinLevel"
            type="number"
            label="MinLevel"
            placeholder="MinLevel"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <PanelSwitch
            form={form}
            name="Upgrade"
            label="Upgrade"
          />
        </div>
      </div>
    );
  };

  const defaultValues = {
    Title: "",
    TitleColor: "#000000",
    SubTitleColor: "#000000",
    Icon: "iibag",
    MinLevel: 1,
    Upgrade: false
  };

  return (
    <BasePanel
      entityName="Npcs Contents Actions"
      description="No Description"
      table="npcs_contents_actions"
      searchName="Category"
      schema={actionSchema}
      apiEndpoint="/api/panel/npcs/contents/actions"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
