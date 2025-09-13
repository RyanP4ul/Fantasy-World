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
import { skillSchema } from "@/validations/panel/skillValidator";
import { ArrowUpDown } from "lucide-react";

// const getTargetFullName = (target: string) => {
//     return target?.Name || target?.id || "Unknown";
// }

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
    { accessorKey: "Reference", header: "Reference" },
    { accessorKey: "Target", header: "Target" },
    { accessorKey: "Effects", header: "Effects" },
    { accessorKey: "Type", header: "Type" },
    {
      accessorKey: "HitResult",
      header: "Hit Result",
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <>
            {row.original?.CanHit && (
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-white mr-1">
                Hit
              </Badge>
            )}
            {row.original?.CanMiss && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-600 dark:text-white mr-1">
                Miss
              </Badge>
            )}
            {row.original?.CanDodge && (
              <Badge className="bg-red-100 text-red-800 dark:bg-red-600 dark:text-white mr-1">
                Dodge
              </Badge>
            )}
            {row.original?.CanCrit && (
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-600 dark:text-white mr-1">
                Critical
              </Badge>
            )}
            {row.original?.AlwaysCrit && (
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-white">
                Always Crit
              </Badge>
            )}
            {!row.original?.CanHit &&
              !row.original?.CanMiss &&
              !row.original?.CanDodge &&
              !row.original?.CanCrit &&
              !row.original?.AlwaysCrit && (
                <Badge variant="outline">Immune</Badge>
              )}
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
            name="Animation"
            type="text"
            label="Animation"
            placeholder="Animation"
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
          <PanelInput
            control={form.control}
            name="Mana"
            type="number"
            label="Mana"
            placeholder="Mana"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <PanelInput
            control={form.control}
            name="Icon"
            type="text"
            label="Icon"
            placeholder="Icon"
          />
        </div>
        <div className="col-span-12 md:col-span-2">
          <PanelInput
            control={form.control}
            name="Range"
            type="number"
            label="Range"
            placeholder="Range"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <PanelInput
            control={form.control}
            name="Damage"
            type="text"
            label="Damage"
            placeholder="Damage"
          />
        </div>
        <div className="col-span-12 md:col-span-2">
          <PanelSelect
            control={form.control}
            name="Reference"
            label="Reference"
            placeholder="Select"
          >
            <SelectItem value="aa">Auto Attack</SelectItem>
            <SelectItem value="a1">Attack 1</SelectItem>
            <SelectItem value="a2">Attack 2</SelectItem>
            <SelectItem value="a3">Attack 3</SelectItem>
            <SelectItem value="a4">Attack 4</SelectItem>
            <SelectItem value="p1">Passive 1</SelectItem>
            <SelectItem value="p2">Passive 2</SelectItem>
            <SelectItem value="p3">Passive 3</SelectItem>
            <SelectItem value="i1">Potion 1</SelectItem>
            <SelectItem value="i2">Potion 2</SelectItem>
          </PanelSelect>
        </div>

        <div className="col-span-12 md:col-span-2">
          <PanelSelect
            control={form.control}
            name="Target"
            label="Target"
            placeholder="Select"
          >
            <SelectItem value="h">Hostile</SelectItem>
            <SelectItem value="s">Self</SelectItem>
            <SelectItem value="f">Friendly</SelectItem>
          </PanelSelect>
        </div>

        <div className="col-span-12 md:col-span-2">
          <PanelSelect
            control={form.control}
            name="Effects"
            label="Effects"
            placeholder="Select"
          >
            <SelectItem value="c">Chain</SelectItem>
            <SelectItem value="f">Funnel</SelectItem>
            <SelectItem value="p">Projectile</SelectItem>
            <SelectItem value="w">Wrapped</SelectItem>
          </PanelSelect>
        </div>
        <div className="col-span-12 md:col-span-2">
          <PanelSelect
            control={form.control}
            name="Type"
            label="Type"
            placeholder="Select"
          >
            <SelectItem value="p">Physical</SelectItem>
            <SelectItem value="m">Magical</SelectItem>
            <SelectItem value="ma">True Damage</SelectItem>
            <SelectItem value="mp">Hybrid</SelectItem>
            <SelectItem value="passive">Passive</SelectItem>
          </PanelSelect>
        </div>

        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Strl"
            type="text"
            label="Skill Animation"
            placeholder="Strl"
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Cooldown"
            type="number"
            label="Cooldown"
            placeholder="Cooldown"
          />
        </div>
        <div className="col-span-12 md:col-span-1">
          <PanelInput
            control={form.control}
            name="HitTargets"
            type="number"
            label="Targets"
            placeholder="HitTargets"
          />
        </div>
        <div className="col-span-12 md:col-span-2">
          <PanelInput
            control={form.control}
            name="RestoreHealth"
            type="number"
            label="RestoreHealth"
            placeholder="RestoreHealth"
          />
        </div>
        <div className="col-span-12 md:col-span-2">
          <PanelInput
            control={form.control}
            name="RestoreMana"
            type="number"
            label="RestoreMana"
            placeholder="RestoreMana"
          />
        </div>

        <div className="col-span-12 md:col-span-2">
          <PanelInput
            control={form.control}
            name="RestoreHealthPercent"
            type="text"
            label="Restore Health %"
            placeholder="RestoreHealthPercent"
          />
        </div>

        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="RestoreManaPercent"
            type="text"
            label="Restore Mana %"
            placeholder="RestoreManaPercent"
          />
        </div>

        <div className="col-span-12 md:col-span-2">
          <PanelInput
            control={form.control}
            name="MultiAttack"
            type="number"
            label="MultiAttack"
            placeholder="MultiAttack"
          />
        </div>

        <div className="col-span-12 md:col-span-2">
          <PanelSwitch form={form} name="CanHit" label="CanHit" />
        </div>
        <div className="col-span-12 md:col-span-2">
          <PanelSwitch form={form} name="CanMiss" label="CanMiss" />
        </div>
        <div className="col-span-12 md:col-span-2">
          <PanelSwitch form={form} name="CanDodge" label="CanDodge" />
        </div>
        <div className="col-span-12 md:col-span-2">
          <PanelSwitch form={form} name="CanCrit" label="CanCrit" />
        </div>
        <div className="col-span-12 md:col-span-2">
          <PanelSwitch form={form} name="AlwaysCrit" label="AlwaysCrit" />
        </div>
      </div>
    );
  };

  const defaultValues = {
    id: 0,
    Name: "",
    Animation: "",
    Description: "",
    Damage: "0.0",
    Range: 301,
    Mana: 10,
    Cooldown: 2000,
    HitTargets: 1,
    Strl: "",
    Target: "h",
    Effects: "w",
    Type: "p",
    CanHit: true,
    CanMiss: true,
    CanDodge: true,
    CanCrit: true,
    AlwaysCrit: false,
    RestoreHealth: 0,
    RestoreMana: 0,
    RestoreHealthPercent: "0.0",
    RestoreManaPercent: "0.0",
    MultiAttack: 1,
  };

  return (
    <BasePanel
      entityName="Skills"
      description="No Description"
      table="skills"
      searchName="Name"
      schema={skillSchema}
      apiEndpoint="/api/panel/skills"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
