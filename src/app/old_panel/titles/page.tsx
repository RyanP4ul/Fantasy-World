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
import { titleSchema } from "@/validations/panel/titleValidator";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [color, setColor] = useState("#3498DB");

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
      accessorKey: "Strength",
      header: "Strength",
    },
    {
      accessorKey: "Intellect",
      header: "Intellect",
    },
    {
      accessorKey: "Endurance",
      header: "Endurance",
    },
    {
      accessorKey: "Dexterity",
      header: "Dexterity",
    },
    {
      accessorKey: "Wisdom",
      header: "Wisdom",
    },
    {
      accessorKey: "Luck",
      header: "Luck",
    }
  ];

  const renderFormFields = (form: any) => {
    return (
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-5">
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
        <div className="col-span-12 md:col-span-12">
          <PanelInput
            control={form.control}
            name="Description"
            type="text"
            label="Description"
            placeholder="Description"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Strength"
            type="number"
            label="Strength"
            placeholder="Strength"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Intellect"
            type="number"
            label="Intellect"
            placeholder="Intellect"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Endurance"
            type="number"
            label="Endurance"
            placeholder="Endurance"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Dexterity"
            type="number"
            label="Dexterity"
            placeholder="Dexterity"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Wisdom"
            type="number"
            label="Wisdom"
            placeholder="Wisdom"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Luck"
            type="number"
            label="Luck"
            placeholder="Luck"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelColorPicker
            name="Color"
            label="Color"
            control={form.control}
          />
        </div>
      </div>
    );
  };

  const defaultValues = {
    Strength: 0,
    Intellect: 0,
    Endurance: 0,
    Dexterity: 0,
    Wisdom: 0,
    Luck: 0,
    Color: "#FFFFFF"
  };

  return (
    <BasePanel
      entityName="Titles"
      description="No Description"
      table="titles"
      searchName="Name"
      schema={titleSchema}
      apiEndpoint="/api/panel/titles"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
