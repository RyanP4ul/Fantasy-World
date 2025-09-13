"use client";

import WebLayout from "@/components/layout/web-layout";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@radix-ui/react-dropdown-menu";
import {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Table } from "../ui/table";
import { ArrowUpDown, ChevronDown, Loader2Icon } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Button } from "../ui/button";
import { Checkbox } from "@radix-ui/react-checkbox";
import Link from "next/link";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "Rank",
    header: ({ column }: { column: any }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-3"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rank
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="text-lg font-bold">
          {row.getValue("Rank")}
        </span>
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
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <img
            src={row.original.DiscordID != null ? `https://cdn.discordapp.com/avatars/${row.original.DiscordID}/${row.original.DiscordAvatar}.png` : "/assets/images/default-avatar.jpg"}
            alt={row.getValue("Name")}
            className="w-12 h-12 rounded-full object-cover object-top mr-4"
          />
          <div>
            <Link
              href={`/charpage/${row.getValue("Name")}`}
              className="font-medium"
            >
              {row.getValue("Name")}
            </Link>
            <p className="text-sm text-gray-400">{row.original.TitleName}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "Class",
    header: "Class",
    cell: ({ row }) => {
      return (
        <span className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-full">
          {row.getValue("Class")}
        </span>
      );
    },
  },
  {
    accessorKey: "Guild",
    header: "Guild",
  },
  {
    accessorKey: "KDRatio",
    header: ({ column }: { column: any }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-3"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          K/D Ratio
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="text-orange-500 font-bold">
          {row.getValue("KDRatio")}
        </span>
      );
    },
  },
  {
    accessorKey: "Area",
    header: "Area",
  },
  {
    accessorKey: "LastLogin",
    header: "Last Login",
  },
];

export default function Ranking({
  data,
  isFetching,
}: {
  data: any[];
  isFetching: boolean;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search name..."
          value={(table.getColumn("Name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("Name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
          disabled={isFetching}
        />
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isFetching ? (
                    <div className="flex items-center justify-center">
                      <Loader2Icon className="mr-2 animate-spin h-4 w-4" />
                      Loading...
                    </div>
                  ) : (
                    "No Results Found"
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
