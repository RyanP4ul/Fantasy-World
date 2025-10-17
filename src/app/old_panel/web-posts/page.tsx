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
import { webPostSchema } from "@/validations/panel/webSchema";
import { ArrowUpDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Page() {
  const { data: session } = useSession();

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
      accessorKey: "Title",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "User",
      header: "Posted By",
      cell: ({ row }: { row: any }) => {
        return <Badge variant="secondary">{row.getValue("User")}</Badge>;
      },
    },
    {
      accessorKey: "Category",
      header: "Category",
      cell: ({ row }: { row: any }) => {
        return <Badge variant="secondary">{row.getValue("Category")}</Badge>;
      },
    },
  ];

  const renderFormFields = (form: any) => {
    form.setValue("UserID", Number(session?.user.id) || -1);

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

        <input
          type="hidden"
          {...form.register("UserID")}
        />

        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Title"
            type="text"
            label="Title"
            placeholder="Title"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelSelect
            control={form.control}
            name="Category"
            label="Category"
            placeholder="Category"
          >
            <SelectItem value="None">None</SelectItem>
            <SelectItem value="Update">Update</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
          </PanelSelect>
        </div>
        <div className="col-span-12 md:col-span-12">
          <PanelTextArea
            control={form.control}
            name="Content"
            label="Content"
            placeholder="Content"
          />
        </div>
        <div className="col-span-12 md:col-span-12">
          <PanelInput
            control={form.control}
            name="Image"
            type="text"
            label="Image"
            placeholder="Image"
          />
        </div>
      </div>
    );
  };

  const defaultValues = {
    UserID: -1,
    Title: "",
    Category: "None",
    Content: "",
    Image: "",
  };

  return (
    <BasePanel
      entityName="Web Posts"
      description="No Description"
      table="web_posts"
      searchName="Title"
      schema={webPostSchema}
      apiEndpoint="/api/panel/web-posts"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
