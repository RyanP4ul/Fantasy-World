"use client";

import { PanelProvider } from "@/providers/PanelProvider";
import { PanelToolbar } from "./panel-toolbar";
import { PanelTable } from "./panel-table";
import { PanelDialog } from "./panel-dialog";
import PanelLayout from "@/components/layout/panel-layout";
import z from "zod";
import { ColumnDef } from "@tanstack/react-table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";

type Props<T> = {
  pageName: string;
  searchField: string;
  description: string;
  tableName: string;
  schema: z.ZodObject<any>;
  url: string;
  columns: ColumnDef<T>[];
  defaultValues: Partial<T>;
  renderFormFields: (form: any) => React.ReactNode;
};

export default function BasePanel<T>(props: Props<T>) {
  const {
    pageName,
    searchField,
    description,
    tableName,
    schema,
    url,
    columns,
    defaultValues,
    renderFormFields,
  } = props;

  return (
    <PanelProvider
      tableName={tableName}
      searchField={searchField}
      schema={schema}
      url={url}
      columns={columns}
      defaultValues={defaultValues}
    >
      <PanelLayout entityName={pageName}>
        <Card className="flex">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">
              {pageName}
              {description && <CardDescription>{description}</CardDescription>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PanelToolbar />
            <PanelTable />
          </CardContent>
        </Card>
        <PanelDialog
          tableName={tableName}
          renderFormFields={renderFormFields}
        />
      </PanelLayout>
    </PanelProvider>
  );
}
