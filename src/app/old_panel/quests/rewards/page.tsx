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
import { rewardSchema } from "@/validations/panel/questValidator";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";

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
      accessorKey: "QuestID",
      header: "QuestID",
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <Link href={`/panel/quests/?edit=${row.original?.QuestID}`}>
            {row.original?.QuestID}
            <Badge variant="secondary" className="ml-2">
              {row.original?.QuestName}
            </Badge>
          </Link>
        );
      },
    },
    {
      accessorKey: "ItemID",
      header: "ItemID",
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <Link href={`/panel/items/?edit=${row.original?.ItemID}`}>
            {row.original?.ItemID}
            <Badge variant="secondary" className="ml-2">
              {row.original?.ItemName}
            </Badge>
          </Link>
        );
      },
    },
    {
      accessorKey: "Quantity",
      header: "Quantity",
    },
    {
      accessorKey: "Rate",
      header: "Rate",
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
          <PanelComboBox
            api="/api/panel/quests"
            name="QuestID"
            label="Quest ID"
            form={form}
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <PanelComboBox
            api="/api/panel/items"
            name="ItemID"
            label="Item ID"
            form={form}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Quantity"
            type="number"
            label="Quantity"
            placeholder="Quantity"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Rate"
            type="text"
            label="Rate"
            placeholder="Rate"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="RewardType"
            type="text"
            label="RewardType"
            placeholder="RewardType"
          />
        </div>
      </div>
    );
  };

  const defaultValues = {
    id: 0,
    Quantity: 1,
    Rate: "1.0",
    RewardType: "S",
  };

  return (
    <BasePanel
      entityName="Quests Rewards"
      description="No Description"
      table="quests_rewards"
      searchName="QuestID"
      schema={rewardSchema}
      apiEndpoint="/api/panel/quests/rewards"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
