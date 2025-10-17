"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  SortingState,
  Table,
} from "@tanstack/react-table";
import { usePanelForm } from "@/hooks/use-panel-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

type PanelContextType<T> = {
  table: Table<T>;
  panelForm: ReturnType<typeof usePanelForm<T>>;
  isFetching: boolean;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
  searchField: string;
  total: number;
  pageIndex: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
};

const PanelContext = createContext<PanelContextType<any> | undefined>(
  undefined
);

export function PanelProvider<T>({
  children,
  tableName,
  searchField,
  schema,
  url,
  columns,
  defaultValues,
}: {
  children: React.ReactNode;
  tableName: string;
  searchField: string;
  schema: z.ZodObject<any>;
  url: string;
  columns: ColumnDef<T>[];
  defaultValues: Partial<T>;
}) {
  const [total, setTotal] = useState(0);
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const panelForm = usePanelForm<T>(tableName, schema, url, defaultValues);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      const res = await fetch(`${url}?page=${pageIndex + 1}&limit=${pageSize}`);
      const json = await res.json();
      panelForm.setData(json.data);
      setTotal(json.total);
      setIsFetching(false);
    };
    fetchData();
  }, [pageIndex, url]);

  const column_actions = {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: { original: any } }) =>
      React.createElement(
        "div",
        { className: "flex space-x-2" },
        React.createElement(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "cursor-pointer",
            onClick: () => panelForm.handleItemEdit(row.original),
          },
          React.createElement(Edit, { className: "h-3 w-3" })
        ),
        React.createElement(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => panelForm.handleItemDelete(row.original),
            className: "text-destructive hover:text-destructive cursor-pointer",
          },
          React.createElement(Trash2, { className: "h-3 w-3" })
        )
      ),
  };

  const allColumns = [
    {
      id: "#",
      header: ({ table }: any) => "",
        // React.createElement("input", {
        //   type: "checkbox",
        //   checked: table.getIsAllPageRowsSelected(),
        //   onChange: (e: any) => table.toggleAllPageRowsSelected(e.target.checked),
        //   className: "rounded-lg cursor-pointer bg-red-500",
        // }),
      cell: ({ row }: any) => "",
        // React.createElement("input", {
        //   type: "checkbox",
        //   checked: row.getIsSelected(),
        //   onChange: (e: any) => row.toggleSelected(e.target.checked),
        // }),
      enableSorting: false,
      enableHiding: false,
    },
    ...columns,
    column_actions as any
  ];

  const table: Table<T> = useReactTable({
    data: panelForm.data,
    columns: allColumns,
    state: { columnFilters, sorting, pagination: { pageIndex, pageSize } },
    manualPagination: true,
    pageCount: Math.ceil(total / pageSize),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const newPage = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(newPage.pageIndex);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return React.createElement(
    PanelContext.Provider,
    {
      value: {
        table,
        panelForm,
        isFetching,
        setIsFetching,
        searchField,
        total,
        pageIndex,
        setPageIndex,
      },
    },
    children
  );
}

export function usePanel<T>() {
  const context = useContext(PanelContext);
  if (!context) throw new Error("usePanel must be used within a PanelProvider");
  return context as PanelContextType<T>;
}
