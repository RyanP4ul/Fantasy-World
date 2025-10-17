"use client";

import BasePanel from "@/components/base-panel";
import {
    PanelComboBox,
  PanelInput,
  PanelSelect,
  PanelSwitch,
  PanelTextArea,
} from "@/components/panel-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { storeSchema } from "@/validations/panel/storeSchema";
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
    {
      accessorKey: "Category",
      header: "Category",
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
          <PanelInput
            control={form.control}
            name="Category"
            type="text"
            label="Category"
            placeholder="Category"
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
        <div className="col-span-12 md:col-span-7">
          <PanelInput
            control={form.control}
            name="Images"
            type="text"
            label="Images"
            placeholder="Images"
          />
        </div>

        <div className="col-span-12 md:col-span-5">
          <PanelInput
            control={form.control}
            name="Price"
            type="text"
            label="Price"
            placeholder="Price"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Gold"
            type="number"
            label="Gold"
            placeholder="Gold"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Coins"
            type="number"
            label="Coins"
            placeholder="Coins"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelComboBox
            api="/api/panel/titles"
            name="TitleID"
            label="TitleID"
            form={form}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelComboBox
            api="/api/panel/achievements"
            name="AchievementID"
            label="AchievementID"
            form={form}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="UpgradeDays"
            type="number"
            label="UpgradeDays"
            placeholder="UpgradeDays"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="QuantityRemain"
            type="number"
            label="QuantityRemain"
            placeholder="QuantityRemain"
          />
        </div>
      </div>
    );
  };

  const defaultValues = {
    Name: "",
    Category: "",
    Description: "",
    Images: "",
    Price: 0.0,
    Gold: 0,
    Coins: 0,
    UpgradeDays: 0,
    QuantityRemain: 0
  };
  

  return (
    <BasePanel
      entityName="Stores"
      description="No Description"
      table="stores"
      searchName="Name"
      schema={storeSchema}
      apiEndpoint="/api/panel/stores"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
