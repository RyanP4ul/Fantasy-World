"use client";

import PanelLayout from "@/components/layout/panel-layout";
import { PanelInput, PanelTextArea } from "@/components/panel-controls";
import BasePanel from "@/components/panel/base-panel";
import { Button } from "@/components/ui/button";
import { Achievement } from "@/features/achievements/achievements.repository";
import { achievementSchema } from "@/validations/panel/achievementSchema";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import React from "react";

export default function Page() {
  const columns = React.useMemo<ColumnDef<Achievement>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-3 cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: "Image",
        header: "Image",
        cell: ({ row }: { row: any }) => (
          <img
            src={`/api/assets/game/achievements/${row.original.Image}`}
            alt="Achievement"
            width={60}
            height={60}
          />
        ),
      },
      {
        accessorKey: "Name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-3 cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: "Description",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-3 cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Description
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
    ],
    []
  );

  const renderFormFields = (form: any) => (
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
          name="Name"
          type="text"
          label="Name"
          placeholder="Name"
        />
      </div>
      <div className="col-span-12 md:col-span-4">
        <PanelInput
          control={form.control}
          name="Image"
          type="text"
          label="Image"
          placeholder="Image"
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
    </div>
  );

  return (
    <BasePanel
      pageName="Achievements"
      searchField="Name"
      description="Manage game achievements here."
      tableName="achievements"
      schema={achievementSchema}
      url="/api/panel/achievements"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={{
        id: 0,
        Name: "",
        Description: "",
        Image: "default.png",
      }}
    />
  );
}
