"use client";

import BasePanel from "@/components/base-panel";
import {
  PanelInput,
  PanelSelect,
  PanelSwitch,
  PanelTextArea,
} from "@/components/panel-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { questSchema } from "@/validations/panel/questValidator";
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
      accessorKey: "Gold",
      header: "Gold",
    },
    {
      accessorKey: "Coins",
      header: "Coins",
    },
    {
      accessorKey: "Reputation",
      header: "Reputation",
    },
    {
      accessorKey: "RewardType",
      header: "RewardType",
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
        <div className="col-span-12 md:col-span-9">
          <PanelInput
            control={form.control}
            name="Name"
            type="text"
            label="Name"
            placeholder="Name"
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
          <PanelTextArea
            control={form.control}
            name="EndText"
            label="EndText"
            placeholder="End Text"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Gold"
            type="number"
            label="Gold"
            placeholder="Gold"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Coins"
            type="number"
            label="Coins"
            placeholder="Coins"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Reputation"
            type="number"
            label="Reputation"
            placeholder="Reputation"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="ClassPoints"
            type="number"
            label="ClassPoints"
            placeholder="ClassPoints"
          />
        </div>
        <div className="col-span-12 md:col-span-2">
          <PanelInput
            control={form.control}
            name="RewardType"
            type="text"
            label="Reward Type"
            placeholder="Reward Type"
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
        <div className="col-span-12 md:col-span-2">
          <PanelInput
            control={form.control}
            name="Slot"
            type="number"
            label="Slot"
            placeholder="Slot"
          />
        </div>
        <div className="col-span-12 md:col-span-2">
          <PanelInput
            control={form.control}
            name="Value"
            type="number"
            label="Value"
            placeholder="Value"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Field"
            type="text"
            label="Field"
            placeholder="Field"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Index"
            type="number"
            label="Index"
            placeholder="Index"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="AchievementID"
            type="number"
            label="AchievementID"
            placeholder="AchievementID"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="TitleID"
            type="number"
            label="TitleID"
            placeholder="TitleID"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="FactionID"
            type="number"
            label="FactionID"
            placeholder="FactionID"
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <PanelInput
            control={form.control}
            name="ReqReputation"
            type="number"
            label="ReqReputation"
            placeholder="ReqReputation"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <PanelInput
            control={form.control}
            name="ReqClassID"
            type="number"
            label="ReqClassID"
            placeholder="ReqClassID"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <PanelInput
            control={form.control}
            name="ReqClassPoints"
            type="number"
            label="ReqClassPoints"
            placeholder="ReqClassPoints"
          />
        </div>

        <div className="col-span-12 md:col-span-2">
          <PanelSwitch form={form} name="Upgrade" label="Upgrade" />
        </div>
        <div className="col-span-12 md:col-span-2">
          <PanelSwitch form={form} name="Once" label="Once" />
        </div>
      </div>
    );
  };

  const defaultValues = {
    id: 0,
    FactionID: 1,
    ReqReputation: 0,
    ReqClassPoints: 0,
    Name: "",
    Description: "",
    EndText: "",
    Experience: 0,
    Gold: 0,
    Coins: 0,
    Reputation: 0,
    ClassPoints: 0,
    RewardType: "S",
    Level: 1,
    Upgrade: false,
    Once: false,
    Slot: -1,
    Value: 0,
    Field: "",
    Index: -1
  };

  return (
    <BasePanel
      entityName="Quests"
      description="No Description"
      table="quests"
      searchName="Name"
      schema={questSchema}
      apiEndpoint="/api/panel/quests"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
