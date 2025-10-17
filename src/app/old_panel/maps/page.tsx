"use client";

import BasePanel from "@/components/base-panel";
import {
  PanelInput,
  PanelSelect,
  PanelSwitch,
} from "@/components/panel-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { mapsSchema } from "@/validations/panel/mapValidator";
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
    { accessorKey: "File", header: "File" },
    { accessorKey: "MaxPlayers", header: "Max Players" },
    { accessorKey: "ReqLevel", header: "Req Level" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <>
            {row.original?.Upgrade && (
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-white mr-1">
                Upgrade
              </Badge>
            )}
            {row.original?.Staff && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-600 dark:text-white mr-1">
                Staff
              </Badge>
            )}
            {row.original?.PvP && (
              <Badge className="bg-red-100 text-red-800 dark:bg-red-600 dark:text-white mr-1">
                PvP
              </Badge>
            )}
            {row.original?.WorldBoss && (
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-600 dark:text-white mr-1">
                World Boss
              </Badge>
            )}
            {row.original?.Timeline && (
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-white">
                Timeline
              </Badge>
            )}
            {!row.original?.Upgrade && !row.original?.Staff && !row.original?.PvP && !row.original?.WorldBoss && !row.original?.Timeline && (
              <Badge variant="outline">
                No Status
              </Badge>
            )}
          </>
        );
      },
      enableHiding: false,
    },
  ];

  const renderFormFields = (form: any) => {
    return (
      <>
        <div className="grid grid-cols-12 gap-4 mb-5">
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
            <PanelInput
              control={form.control}
              name="File"
              type="text"
              label="File"
              placeholder="File"
            />
          </div>

          <div className="col-span-12 md:col-span-3">
            <PanelInput
              control={form.control}
              name="MaxPlayers"
              type="number"
              label="Max Players"
              placeholder="Max Players"
            />
          </div>

          <div className="col-span-12 md:col-span-3">
            <PanelInput
              control={form.control}
              name="ReqLevel"
              type="number"
              label="Req Level"
              placeholder="Req Level"
            />
          </div>

          <div className="col-span-12 md:col-span-3">
            <PanelSwitch form={form} name="ReqParty" label="Req Party" />
          </div>

          <div className="col-span-12 md:col-span-3">
            <PanelSwitch form={form} name="Upgrade" label="Upgrade" />
          </div>

          <div className="col-span-12 md:col-span-3">
            <PanelSwitch form={form} name="Staff" label="Staff" />
          </div>

          <div className="col-span-12 md:col-span-3">
            <PanelSwitch form={form} name="PvP" label="PvP" />
          </div>

          <div className="col-span-12 md:col-span-3">
            <PanelSwitch form={form} name="WorldBoss" label="World Boss" />
          </div>

          <div className="col-span-12 md:col-span-3">
            <PanelSwitch form={form} name="Timeline" label="Timeline" />
          </div>
        </div>
      </>
    );
  };

  const defaultValues = {
    MaxPlayers: 1,
    ReqLevel: 1,
    ReqParty: false,
    Upgrade: false,
    Staff: false,
    PvP: false,
    WorldBoss: false,
    Timeline: false,
  };

  return (
    <BasePanel
      entityName="Maps"
      description="No description"
      table="maps"
      searchName="Name"
      schema={mapsSchema}
      apiEndpoint="/api/panel/maps"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
