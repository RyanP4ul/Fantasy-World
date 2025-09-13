"use client";

import BasePanel from "@/components/base-panel";
import {
  PanelComboBox,
  PanelDatePicker,
  PanelInput,
  PanelSelect,
  PanelSwitch,
  PanelTextArea,
} from "@/components/panel-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { seasonalSchema } from "@/validations/panel/shopValidator";
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
      accessorKey: "ShopID",
      header: "ShopID",
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <Link href={`/panel/shops/?edit=${row.original?.ShopID}`}>
            {row.original?.ShopID}
            <Badge variant="secondary" className="ml-2">
              {row.original?.ShopName}
            </Badge>
          </Link>
        );
      },
    },
    {
      accessorKey: "EndDate",
      header: "End Date",
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
            api="/api/panel/shops"
            name="ShopID"
            label="Shop ID"
            form={form}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PanelDatePicker
            form={form}
            name="EndDate"
            label="End Date"
            placeholder="End Date"
            description="Test"
          />
        </div>
      </div>
    );
  };

  const defaultValues = {
    id: 0,
    QuantityRemain: 1,
  };

  return (
    <BasePanel
      entityName="Shops Seasonal"
      description="No Description"
      table="shops_seasonal"
      searchName="ShopID"
      schema={seasonalSchema}
      apiEndpoint="/api/panel/shops/seasonal"
      columns={columns}
      renderFormFields={renderFormFields}
      defaultValues={defaultValues}
    />
  );
}
