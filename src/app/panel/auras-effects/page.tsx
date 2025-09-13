"use client";

import BasePanel from "@/components/base-panel";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  PanelComboBox,
  PanelInput,
  PanelSelect,
} from "@/components/panel-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { auraEffectSchema } from "@/validations/panel/auraEffectValidator";
import { ArrowUpDown, Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import z from "zod";
import React from "react";
import { stat } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
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
      accessorKey: "AuraID",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            AuraID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <Link href={`/panel/auras/?edit=${row.original?.AuraID}`}>
            <span className="mr-2">{row.original?.AuraID}</span>
            <Badge variant="secondary">{row.original?.Aura}</Badge>
          </Link>
        );
      },
    },
    // {
    //   accessorKey: "Aura",
    //   header: "Aura",
    //   cell: ({ row }: { row: { original: any } }) => {
    //     return <Badge variant="secondary">{row.original?.Aura}</Badge>;
    //   },
    // },
    {
      accessorKey: "Stat",
      header: "Stat",
      cell: ({ row }: { row: { original: any } }) => {
        return <Badge variant="secondary">{stat(row.original?.Stat)}</Badge>;
      },
    },
    { accessorKey: "Value", header: "Value" },
    { accessorKey: "Type", header: "Type" },
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
          <PanelComboBox api="/api/panel/auras" name="AuraID" label="Aura ID" form={form} />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelInput
            control={form.control}
            name="Value"
            type="text"
            label="Value"
            placeholder="Value123"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelSelect
            control={form.control}
            name="Stat"
            label="Stat"
            placeholder="Select"
          >
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="cai">Damage Resistance</SelectItem>
            <SelectItem value="cao">Damage Boosts</SelectItem>
            <SelectItem value="cpi">Physical Resistance</SelectItem>
            <SelectItem value="cpo">Physical Boosts</SelectItem>
            <SelectItem value="cmi">Magical Resistance</SelectItem>
            <SelectItem value="cmo">Magical Boosts</SelectItem>
            <SelectItem value="chi">Healing Intake</SelectItem>
            <SelectItem value="cho">Healing Boosts</SelectItem>
            <SelectItem value="tdo">Evasion</SelectItem>
            <SelectItem value="tha">Haste</SelectItem>
            <SelectItem value="thi">Accuracy</SelectItem>
            <SelectItem value="tcr">Critical Chance</SelectItem>
            <SelectItem value="scm">Critical Multiplier</SelectItem>
            <SelectItem value="STR">Strength</SelectItem>
            <SelectItem value="END">Endurance</SelectItem>
            <SelectItem value="DEX">Dexterity</SelectItem>
            <SelectItem value="INT">Intellect</SelectItem>
            <SelectItem value="WIS">Wisdom</SelectItem>
            <SelectItem value="LCK">Luck</SelectItem>
            <SelectItem value="ap">Attack Power</SelectItem>
            <SelectItem value="sp">Spell Power</SelectItem>
          </PanelSelect>
        </div>
        <div className="col-span-12 md:col-span-3">
          <PanelSelect
            control={form.control}
            name="Type"
            label="Type"
            placeholder="Select"
          >
            <SelectItem value="+">+</SelectItem>
            <SelectItem value="-">-</SelectItem>
            <SelectItem value="*">*</SelectItem>
          </PanelSelect>
        </div>
      </div>
    );
  };

  const defaultValues = {
    Stat: "none",
    Value: "0.0",
    Type: "+",
  };

  return (
    <BasePanel
      entityName="Auras Effects"
      description="Aura Effects are the specific actions those auras perform, such as increasing damage, reducing defense."
      table="auras_effects"
      searchName="AuraID"
      schema={auraEffectSchema}
      apiEndpoint="/api/panel/auras-effects"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
