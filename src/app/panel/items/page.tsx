"use client";

import BasePanel from "@/components/base-panel";
import {
  PanelComboBox,
  PanelInput,
  PanelSelect,
  PanelSwitch,
} from "@/components/panel-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { getRarity } from "@/lib/rarities";
import { equipments } from "@/lib/utils";
import { itemSchema } from "@/validations/panel/itemValidator";
import { ArrowUpDown, Coins } from "lucide-react";
import { useState } from "react";
import { set } from "zod";

const ItemType = (form: any, type: string): void => {
  switch (type.toLowerCase()) {
    case "item":
      form.setValue("Icon", "iibag");
      break;
    case "class":
      form.setValue("Icon", "iiclass");
      break;
    case "armor":
      form.setValue("Icon", "iwarmor");
      break;
    case "axe":
      form.setValue("Icon", "iwaxe");
      break;
    case "bow":
      form.setValue("Icon", "iwbow");
      break;
    case "cape":
      form.setValue("Icon", "iicape");
      break;
    case "dagger":
      form.setValue("Icon", "iwdagger");
      break;
    case "gauntlet":
      form.setValue("Icon", "iwsword");
      break;
    case "ground":
      form.setValue("Icon", "imr2");
      break;
    case "gun":
      form.setValue("Icon", "iwgun");
      break;
    case "helm":
      form.setValue("Icon", "iihelm");
      break;
    case "house":
      form.setValue("Icon", "ihhouse");
      break;
    case "floor item":
      form.setValue("Icon", "ihfloor");
      break;
    case "mace":
      form.setValue("Icon", "iwsword");
      break;
    case "pet":
      form.setValue("Icon", "iipet");
      break;
    case "staff":
      form.setValue("Icon", "iwstaff");
      break;
    case "sword":
      form.setValue("Icon", "iwsword");
      break;
    case "enhancement":
    case "serveruse":
      form.setValue("Icon", "iidesign");
      break;
    case "title":
      form.setValue("Icon", "iin1");
      break;
  }
};

export default function Page() {
  const [type, setType] = useState<string | null>(null);

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
      cell: ({ row }: { row: { original: any } }) => {
        const rarity = getRarity(row.original?.Rarity);

        return (
          <div className="flex">
            {/* <img
            src={`/assets/images/equipment/${row.original?.Type}.png`}
            alt={row.original?.Type}
            width={16}
            height={16}
            className="mr-2"
          /> */}
            {row.original?.Name} |
            {row.original?.Rarity && (
              <div className={`ml-2 text-[${rarity.color}]`}>
                {rarity.sName}
              </div>
            )}
          </div>
        );
      },
    },
    { accessorKey: "Type", header: "Type" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <>
            {row.original?.Coins && (
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-white mr-1">
                Coins
              </Badge>
            )}
            {row.original?.Sell && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-600 dark:text-white mr-1">
                Sell
              </Badge>
            )}
            {row.original?.Temporary && (
              <Badge className="bg-red-100 text-red-800 dark:bg-red-600 dark:text-white mr-1">
                Temporary
              </Badge>
            )}
            {row.original?.Upgrade && (
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-600 dark:text-white mr-1">
                Upgrade
              </Badge>
            )}
            {row.original?.Staff && (
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-white">
                Staff
              </Badge>
            )}
            {!row.original?.Coins &&
              !row.original?.Sell &&
              !row.original?.Temporary &&
              !row.original?.Upgrade &&
              !row.original?.Staff && <Badge variant="outline">None</Badge>}
          </>
        );
      },
      enableHiding: false,
    },
  ];

  const renderFormFields = (form: any) => {

    setType(form.getValues("Type"));

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
        <div
          className={`col-span-12 md:col-span-${
            type === "Enhancement" ? 4 : 6
          }`}
        >
          <PanelInput
            control={form.control}
            name="Name"
            type="text"
            label="Name"
            placeholder="Name"
            description="Only accept letters, numbers and white space"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelSelect
            control={form.control}
            name="Type"
            label="Type"
            placeholder="Type"
          >
            <SelectItem
              value="Item"
              onMouseDown={() => {
                ItemType(form, "Item");
                setType("Item");
              }}
            >
              Item
            </SelectItem>
            <SelectItem
              value="Class"
              onMouseDown={() => {
                ItemType(form, "Class");
                setType("Class");
              }}
            >
              Class
            </SelectItem>
            <SelectItem
              value="Armor"
              onMouseDown={() => {
                ItemType(form, "Armor");
                setType("Armor");
              }}
            >
              Armor
            </SelectItem>
            <SelectItem
              value="Axe"
              onMouseDown={() => {
                ItemType(form, "Axe");
                setType("Axe");
              }}
            >
              Axe
            </SelectItem>
            <SelectItem
              value="Bow"
              onMouseDown={() => {
                ItemType(form, "Bow");
                setType("Bow");
              }}
            >
              Bow
            </SelectItem>
            <SelectItem
              value="Cape"
              onMouseDown={() => {
                ItemType(form, "Cape");
                setType("Cape");
              }}
            >
              Cape
            </SelectItem>
            <SelectItem
              value="Dagger"
              onMouseDown={() => {
                ItemType(form, "Dagger");
                setType("Dagger");
              }}
            >
              Dagger
            </SelectItem>
            <SelectItem
              value="Gauntlet"
              onMouseDown={() => {
                ItemType(form, "Gauntlet");
                setType("Gauntlet");
              }}
            >
              Gauntlet
            </SelectItem>
            <SelectItem
              value="Ground"
              onMouseDown={() => {
                ItemType(form, "Ground");
                setType("Ground");
              }}
            >
              Ground
            </SelectItem>
            <SelectItem
              value="Gun"
              onMouseDown={() => {
                ItemType(form, "Gun");
                setType("Gun");
              }}
            >
              Gun
            </SelectItem>
            <SelectItem
              value="Helm"
              onMouseDown={() => {
                ItemType(form, "Helm");
                setType("Helm");
              }}
            >
              Helm
            </SelectItem>
            <SelectItem
              value="House"
              onMouseDown={() => {
                ItemType(form, "House");
                setType("House");
              }}
            >
              House
            </SelectItem>
            <SelectItem
              value="Floor Item"
              onMouseDown={() => {
                ItemType(form, "Floor Item");
                setType("Floor Item");
              }}
            >
              Floor Item
            </SelectItem>
            <SelectItem
              value="Mace"
              onMouseDown={() => {
                ItemType(form, "Mace");
                setType("Mace");
              }}
            >
              Mace
            </SelectItem>
            <SelectItem
              value="Misc"
              onMouseDown={() => {
                ItemType(form, "Misc");
                setType("Misc");
              }}
            >
              Misc
            </SelectItem>
            <SelectItem
              value="Pet"
              onMouseDown={() => {
                ItemType(form, "Pet");
                setType("Pet");
              }}
            >
              Pet
            </SelectItem>
            <SelectItem
              value="Polearm"
              onMouseDown={() => {
                ItemType(form, "Polearm");
                setType("Polearm");
              }}
            >
              Polearm
            </SelectItem>
            <SelectItem
              value="Staff"
              onMouseDown={() => {
                ItemType(form, "Staff");
                setType("Staff");
              }}
            >
              Staff
            </SelectItem>
            <SelectItem
              value="Stave"
              onMouseDown={() => {
                ItemType(form, "Stave");
                setType("Stave");
              }}
            >
              Stave
            </SelectItem>
            <SelectItem
              value="Sword"
              onMouseDown={() => {
                ItemType(form, "Sword");
                setType("Sword");
              }}
            >
              Sword
            </SelectItem>
            <SelectItem
              value="ServerUse"
              onMouseDown={() => {
                ItemType(form, "ServerUse");
                setType("ServerUse");
              }}
            >
              ServerUse
            </SelectItem>
            <SelectItem
              value="Title"
              onMouseDown={() => {
                ItemType(form, "Title");
                setType("Title");
              }}
            >
              Title
            </SelectItem>
            <SelectItem
              value="Enhancement"
              onMouseDown={() => {
                ItemType(form, "Enhancement");
                setType("Enhancement");
                console.log("Enhancement selected");
              }}
            >
              Enhancement
            </SelectItem>
          </PanelSelect>
        </div>
        {(type === "Enhancement") && (
          <div className="col-span-12 md:col-span-2">
            <PanelSelect
              control={form.control}
              name="Equipment"
              label="Equipment"
              placeholder="Equipment"
            >
              <SelectItem value="Weapon">Weapon</SelectItem>
              <SelectItem value="he">Helm</SelectItem>
              <SelectItem value="ar">Class</SelectItem>
              <SelectItem value="co">Armor</SelectItem>
              <SelectItem value="ba">Cape</SelectItem>
            </PanelSelect>
          </div>
        )}
        <div className="col-span-12 md:col-span-12">
          <PanelInput
            control={form.control}
            name="Description"
            type="text"
            label="Description"
            placeholder="Description"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="File"
            type="text"
            label="File"
            placeholder="File"
            description="No need to include the path, just the SWF file name."
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Link"
            type="text"
            label="Link"
            placeholder="Link"
          />
        </div>
        <div className="col-span-12 md:col-span-2">
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
            name="Level"
            type="number"
            label="Level"
            placeholder="Level"
          />
        </div>
        <div className="col-span-12 md:col-span-2">
          <PanelInput
            control={form.control}
            name="DPS"
            type="number"
            label="DPS"
            placeholder="DPS"
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
            name="Rarity"
            type="number"
            label="Rarity"
            placeholder="Rarity"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Quantity"
            type="number"
            label="Quantity"
            placeholder="Quantity"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Stack"
            type="number"
            label="Stack"
            placeholder="Stack"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Cost"
            type="number"
            label="Cost"
            placeholder="Cost"
          />
        </div>
        <div className="col-span-12 md:col-span-2">
          <PanelSwitch name="Coins" label="Coins" form={form} />
        </div>
        <div className="col-span-12 md:col-span-2">
          <PanelSwitch name="Sell" label="Sell" form={form} />
        </div>
        <div className="col-span-12 md:col-span-2">
          <PanelSwitch name="Temporary" label="Temporary" form={form} />
        </div>
        <div className="col-span-12 md:col-span-2">
          <PanelSwitch name="Upgrade" label="Upgrade" form={form} />
        </div>
        <div className="col-span-12 md:col-span-2">
          <PanelSwitch name="Staff" label="Staff" form={form} />
        </div>
        <div className="col-span-12 md:col-span-2">
          <PanelSwitch name="Trade" label="Trade" form={form} />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelComboBox
            api="/api/panel/enhancements"
            name="EnhID"
            label="Enhancement ID"
            form={form}
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <PanelComboBox
            api="/api/panel/factions"
            name="FactionID"
            label="Faction ID"
            form={form}
          />
        </div>

        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="ReqReputation"
            type="number"
            label="Required Reputation"
            placeholder="Required Reputation"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelComboBox
            api="/api/panel/items?equipment=ar"
            name="ReqClassID"
            label="Required Class ID"
            form={form}
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="ReqClassPoints"
            type="number"
            label="Required Class Points"
            placeholder="Required Class Points"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="QuestStringIndex"
            type="number"
            label="Quest String Index"
            placeholder="Quest String Index"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="QuestStringValue"
            type="text"
            label="Quest String Value"
            placeholder="Quest String Value"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="ReqQuests"
            type="text"
            label="Required Quests"
            placeholder="Required Quests"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="Meta"
            type="text"
            label="Meta"
            placeholder="Meta"
          />
        </div>
      </div>
    );
  };

  const defaultValues = {
    File: "",
    Link: "",
    Level: 1,
    DPS: 100,
    Range: 50,
    Rarity: 10,
    Quantity: 1,
    Stack: 1,
    Cost: 0,
    Coins: false,
    Sell: false,
    Temporary: false,
    Upgrade: false,
    Staff: false,
    EnhID: 1,
    FactionID: 1,
    ReqReputation: 0,
    ReqClassID: 0,
    ReqClassPoints: 0,
    QuestStringIndex: -1,
    QuestStringValue: 0,
    ReqQuests: "",
    Meta: "",
  };

  return (
    <BasePanel
      entityName="Items"
      description="No description"
      table="items"
      searchName="Name"
      schema={itemSchema}
      apiEndpoint="/api/panel/items"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
