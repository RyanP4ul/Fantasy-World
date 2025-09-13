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
import { decorationSchema } from "@/validations/panel/titleValidator";
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
          <PanelTextArea
            control={form.control}
            name="Description"
            label="Description"
            placeholder="Description"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="File"
            type="text"
            label="File"
            placeholder="File"
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
    Description: "",
    File: "",
    Linkage: "",
  };

  return (
    <BasePanel
      entityName="Titles Decorations"
      description="No Description"
      table="titles_styles"
      searchName="Name"
      schema={decorationSchema}
      apiEndpoint="/api/panel/titles/decorations"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
