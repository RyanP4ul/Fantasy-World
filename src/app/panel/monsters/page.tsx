"use client";

import BasePanel from "@/components/base-panel";
import { PanelInput, PanelSelect, PanelSwitch } from "@/components/panel-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { monsterSchema } from "@/validations/panel/monsterValidator";
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
    { accessorKey: "Level", header: "Level" },
    { accessorKey: "Health", header: "Health" },
    { accessorKey: "Respawn", header: "Respawn" },
    { accessorKey: "Speed", header: "Attack Speed" },
    {
      accessorKey: "Drop",
      header: "Drop",
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <>
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-white mr-2">
              Gold {row.original?.Gold}
            </Badge>
            <Badge className="bg-yellow-200 text-yellow-700 dark:bg-yellow-800 dark:text-white">
              Coins {row.original?.Coin}
            </Badge>
          </>
        );
      },
      enableHiding: false,
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
          <PanelSelect
            control={form.control}
            name="Category"
            label="Category"
            placeholder="Select"
          >
            <SelectItem value="M1">Tank Melee</SelectItem>
            <SelectItem value="M2">Dodge Melee</SelectItem>
            <SelectItem value="M3">Full Hybrid</SelectItem>
            <SelectItem value="M4">Power Melee</SelectItem>
            <SelectItem value="S1">Luck Hybrid</SelectItem>
            <SelectItem value="C1">Offensive Caster</SelectItem>
            <SelectItem value="C2">Defensive Caster</SelectItem>
            <SelectItem value="C3">Power Caster</SelectItem>
          </PanelSelect>
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
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Level"
            type="number"
            label="Level"
            placeholder="Level"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Health"
            type="number"
            label="Health"
            placeholder="Health"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Mana"
            type="number"
            label="Mana"
            placeholder="Mana"
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
            name="Coin"
            type="number"
            label="Coin"
            placeholder="Coin"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Experience"
            type="number"
            label="Experience"
            placeholder="Experience"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="ClassPoint"
            type="number"
            label="ClassPoint"
            placeholder="ClassPoint"
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
            name="Respawn"
            type="number"
            label="Respawn"
            placeholder="Respawn"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Speed"
            type="number"
            label="Speed"
            placeholder="Speed"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Damage"
            type="text"
            label="Damage"
            placeholder="Damage"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelSelect
            control={form.control}
            name="DamageType"
            label="DamageType"
            placeholder="Select"
          >
            <SelectItem value="p">Physical</SelectItem>
            <SelectItem value="h">Hybrid</SelectItem>
            <SelectItem value="m">Magical</SelectItem>
          </PanelSelect>
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelSwitch
            form={form}
            name="Immune"
            label="Immune"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelSwitch
            form={form}
            name="WorldBoss"
            label="WorldBoss"
          />
        </div>
      </div>
    );
  };

  const defaultValues = {
    id: 0,
    Name: "",
    File: "",
    Link: "",
    Category: "M1",
    Level: 1,
    Health: 1000,
    Mana: 100,
    Gold: 0,
    Coin: 0,
    Experience: 0,
    ClassPoint: 0,
    Reputation: 0,
    Respawn: 6,
    Speed: 1500,
    Damage: "0.0",
    DamageType: "p",
    Immune: false,
    WorldBoss: false,
  };

  return (
    <BasePanel
      entityName="Monsters"
      description="No Description"
      table="monsters"
      searchName="Name"
      schema={monsterSchema}
      apiEndpoint="/api/panel/monsters"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
