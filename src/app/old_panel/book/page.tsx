"use client";

import BasePanel from "@/components/base-panel";
import { PanelInput, PanelSelect, PanelSwitch, PanelTextArea } from "@/components/panel-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { bookSchema } from "@/validations/panel/bookSchema";
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
    { accessorKey: "Type", header: "Type" },
    { accessorKey: "Field", header: "Field" },
    { accessorKey: "Level", header: "Level" },
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
          <PanelInput
            control={form.control}
            name="Level"
            type="number"
            label="Level"
            placeholder="Level"
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
        
        <div className="col-span-12 md:col-span-6">
          <PanelTextArea
            control={form.control}
            name="Lock"
            label="Lock"
            placeholder="Lock"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
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
            name="Map"
            type="text"
            label="Map"
            placeholder="Map"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Type"
            type="text"
            label="Type"
            placeholder="Type"
          />
        </div>
    
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Label"
            type="text"
            label="Label"
            placeholder="Label"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Shop"
            type="number"
            label="Shop"
            placeholder="Shop"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <PanelInput
            control={form.control}
            name="Field"
            type="text"
            label="Field"
            placeholder="Field"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <PanelInput
            control={form.control}
            name="Index"
            type="number"
            label="Index"
            placeholder="Index"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <PanelInput
            control={form.control}
            name="Value"
            type="number"
            label="Value"
            placeholder="Value"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <PanelSwitch
            form={form}
            name="Hide"
            label="Hide"
          />
        </div>

      </div>
    );
  };

  const defaultValues = {
    id: 0,
    Name: "",
    File: "",
    Linkage: "",
    Lock: "",
    Description: "",
    Level: 1,
    Hide: false
  };

  return (
    <BasePanel
      entityName="Book Of Lore"
      description="No description"
      table="book"
      searchName="Name"
      schema={bookSchema}
      apiEndpoint="/api/panel/book"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
