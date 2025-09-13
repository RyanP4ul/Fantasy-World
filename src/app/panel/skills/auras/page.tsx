"use client";

import BasePanel from "@/components/base-panel";
import {
  PanelComboBox,
  PanelInput,
  PanelSelect,
} from "@/components/panel-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import React from "react";
import { stat } from "@/lib/utils";
import { auraSchema } from "@/validations/panel/skillValidator";
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
      accessorKey: "SkillID",
      header: "SkillID",
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <Link href={`/panel/skills/?edit=${row.original?.SkillID}`}>
            {row.original?.SkillID}
            <Badge variant="secondary" className="ml-2">
              {row.original?.SkillName}
            </Badge>
          </Link>
        );
      },
    },
    {
      accessorKey: "AuraID",
      header: "AuraID",
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <Link href={`/panel/auras/?edit=${row.original?.AuraID}`}>
            {row.original?.AuraID}
            <Badge variant="secondary" className="ml-2">
              {row.original?.AuraName}
            </Badge>
          </Link>
        );
      },
    },
    {
      accessorKey: "ReqAuraID",
      header: "ReqAuraID",
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <>
            {row.original?.ReqAuraID != null ? (
              <Link href={`/panel/auras/?edit=${row.original?.ReqAuraID}`}>
                {row.original?.ReqAuraID}
                <Badge variant="secondary" className="ml-2">
                  {row.original?.ReqAuraName}
                </Badge>
              </Link>
            ) : (
              <div>
                {row.original?.ReqAuraID}
                <Badge variant="secondary" className="ml-2">
                  {row.original?.ReqAuraName}
                </Badge>
              </div>
            )}
          </>
        );
      },
    },
    {
      accessorKey: "NoAuraID",
      header: "NoAuraID",
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <>
            {row.original?.NoAuraID != null ? (
              <Link href={`/panel/auras/?edit=${row.original?.NoAuraID}`}>
                {row.original?.NoAuraID}
                <Badge variant="secondary" className="ml-2">
                  {row.original?.NoAuraName}
                </Badge>
              </Link>
            ) : (
              <div>
                {row.original?.NoAuraID}
                <Badge variant="secondary" className="ml-2">
                  {row.original?.NoAuraName}
                </Badge>
              </div>
            )}
          </>
        );
      },
    },
  ];

  const renderFormFields = (form: any) => {
    return (
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="id"
            type="number"
            label="Id"
            placeholder="Id"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelComboBox
            api="/api/panel/skills"
            name="SkillID"
            label="Skill ID"
            form={form}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelComboBox
            api="/api/panel/auras"
            name="AuraID"
            label="Aura ID"
            form={form}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelComboBox
            api="/api/panel/auras"
            name="ReqAuraID"
            label="ReqAuraID"
            form={form}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelComboBox
            api="/api/panel/auras"
            name="NoAuraID"
            label="NoAuraID"
            form={form}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="ReqStack"
            type="number"
            label="ReqStack"
            placeholder="ReqStack"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="ConsumeStack"
            type="number"
            label="ConsumeStack"
            placeholder="ConsumeStack"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelInput
            control={form.control}
            name="ConsumeAuraID"
            type="number"
            label="ConsumeAuraID"
            placeholder="ConsumeAuraID"
          />
        </div>
      </div>
    );
  };

  const defaultValues = {
    ReqAuraID: 0,
    NoAuraID: 0,
    ConsumeAuraID: 0,
    ReqStack: 0,
    ConsumeStack: 0,
  };

  return (
    <BasePanel
      entityName="Skills Auras"
      description="No Description"
      table="skills_auras"
      searchName="SkillID"
      schema={auraSchema}
      apiEndpoint="/api/panel/skills/auras"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
