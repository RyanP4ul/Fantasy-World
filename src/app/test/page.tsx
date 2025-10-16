"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";

type Achievement = {
  id: number;
  Name: string;
  Description: string;
};

export default function UsersTable() {
  
  const [data, setData] = React.useState<Achievement[]>([]);
  const [total, setTotal] = React.useState(0);
  const [columnFilters, setColumnFilters] = React.useState<any[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pageIndex, setPageIndex] = React.useState(0);

  const pageSize = 10;

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/test?page=${pageIndex + 1}&limit=${pageSize}`);
      const json = await res.json();
      setData(json.data);
      setTotal(json.total);
    };
    fetchData();
  }, [pageIndex]);

  const columns = React.useMemo<ColumnDef<Achievement>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <div
            className="cursor-pointer select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID {column.getIsSorted() === "asc" ? "▲" : column.getIsSorted() === "desc" ? "▼" : ""}
          </div>
        ),
      },
      {
        accessorKey: "Name",
        header: ({ column }) => (
          <div className="flex flex-col">
            <div
              className="cursor-pointer select-none"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Name {column.getIsSorted() === "asc" ? "▲" : column.getIsSorted() === "desc" ? "▼" : ""}
            </div>
            <input
              className="border rounded px-1 text-sm mt-1"
              placeholder="Filter..."
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(e) => column.setFilterValue(e.target.value)}
            />
          </div>
        ),
      },
      {
        accessorKey: "Description",
        header: ({ column }) => (
          <div className="flex flex-col">
            <div
              className="cursor-pointer select-none"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Description {column.getIsSorted() === "asc" ? "▲" : column.getIsSorted() === "desc" ? "▼" : ""}
            </div>
            <select
              className="border rounded px-1 text-sm mt-1"
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(e) => column.setFilterValue(e.target.value)}
            >
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
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

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">Achievements (API + Client Filters + Sorting)</h1>

      <table className="border-collapse border w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border px-2 py-1 align-top">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border px-2 py-1">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex items-center gap-2">
        <button
          className="border px-2 py-1 rounded"
          onClick={() => setPageIndex((old) => Math.max(old - 1, 0))}
          disabled={pageIndex === 0}
        >
          Prev
        </button>
        <span>
          Page {pageIndex + 1} / {Math.ceil(total / pageSize)}
        </span>
        <button
          className="border px-2 py-1 rounded"
          onClick={() =>
            setPageIndex((old) =>
              old + 1 < Math.ceil(total / pageSize) ? old + 1 : old
            )
          }
          disabled={pageIndex + 1 >= Math.ceil(total / pageSize)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
