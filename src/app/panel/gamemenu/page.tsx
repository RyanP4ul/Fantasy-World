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
import { gameMenuSchema } from "@/validations/panel/gameMenuSchema";
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
      accessorKey: "Text",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Text
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "Action",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Action
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
        <div className="col-span-12 md:col-span-5">
          <PanelInput
            control={form.control}
            name="Text"
            type="text"
            label="Text"
            placeholder="Text"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <PanelSelect
            control={form.control}
            name="Action"
            label="Action"
            placeholder="Select"
          >
            <SelectItem value="Nothing">Nothing</SelectItem>
            <SelectItem value="PvP">PvP</SelectItem>
            <SelectItem value="NavigateURL">NavigateURL</SelectItem>
            <SelectItem value="WorldMap">WorldMap</SelectItem>
            <SelectItem value="GotoAndPlay">GotoAndPlay</SelectItem>
            <SelectItem value="GotoAndStop">GotoAndStop</SelectItem>
            <SelectItem value="Item Shop">Item Shop</SelectItem>
            <SelectItem value="Hair Shop">Hair Shop</SelectItem>
            <SelectItem value="Enhance Shop">Enhance Shop</SelectItem>
            <SelectItem value="/Join">/Join</SelectItem>
            <SelectItem value="News">News</SelectItem>
            <SelectItem value="Membership">Membership</SelectItem>
          </PanelSelect>
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="ActID"
            type="number"
            label="ActID"
            placeholder="ActID"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="String"
            type="text"
            label="String"
            placeholder="String"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="ParentFrame"
            type="text"
            label="ParentFrame"
            placeholder="ParentFrame"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Frame"
            type="text"
            label="Frame"
            placeholder="Frame"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Pad"
            type="text"
            label="Pad"
            placeholder="Pad"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Icon"
            type="text"
            label="Icon"
            placeholder="Icon"
            description="You can you assets icon"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="SubHeaderText"
            type="text"
            label="SubHeaderText"
            placeholder="SubHeaderText"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="SubHeaderColor"
            type="text"
            label="SubHeaderColor"
            placeholder="SubHeaderColor"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Style"
            type="text"
            label="Style"
            placeholder="Style"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="AltMode"
            type="text"
            label="AltMode"
            placeholder="AltMode"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="AltText"
            type="text"
            label="AltText"
            placeholder="AltText"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="AltIcon"
            type="text"
            label="AltIcon"
            placeholder="AltIcon"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="AltSubHeaderText"
            type="text"
            label="AltSubHeaderText"
            placeholder="AltSubHeaderText"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="AltSubHeaderColor"
            type="text"
            label="AltSubHeaderColor"
            placeholder="AltSubHeaderColor"
          />
        </div>
      </div>
    );
  };

  const defaultValues = {};

  return (
    <BasePanel
      entityName="Game Menu"
      description="No Description"
      table="game_menu"
      searchName="Text"
      schema={gameMenuSchema}
      apiEndpoint="/api/panel/gamemenu"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
