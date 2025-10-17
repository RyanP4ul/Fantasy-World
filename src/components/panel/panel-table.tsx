"use client";

import { usePanel } from "@/providers/PanelProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Loader2Icon } from "lucide-react";
import { flexRender } from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

export function PanelTable() {
  const { table, isFetching } = usePanel();

  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;

  const getPageItems = () => {
    const items: (number | "...")[] = [];
    if (pageCount <= 9) {
      for (let i = 1; i <= pageCount; i++) items.push(i);
      return items;
    }

    items.push(1);

    const left = Math.max(2, pageIndex + 1 - 1);
    const right = Math.min(pageCount - 1, pageIndex + 1 + 1);

    if (left > 2) items.push("...");

    for (let i = left; i <= right; i++) items.push(i);

    if (right < pageCount - 1) items.push("...");

    items.push(pageCount);

    return items;
  };

  const pageItems = getPageItems();

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
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
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2Icon className="mr-2 animate-spin h-4 w-4" />
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row: any) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell: any) => (
                        <TableCell key={cell.id}>
                          {cell.column.columnDef.cell
                            ? (cell.column.columnDef.cell as any)(
                                cell.getContext()
                              )
                            : cell.getValue()}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      No Results Found
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit mt-5">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink
                  aria-label="Go to first page"
                  size="default"
                  className={`gap-1 px-2.5 sm:pl-2.5 ${
                    !table.getCanPreviousPage()
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  onClick={() => table.setPageIndex(0)}
                >
                  <span className="hidden sm:block">First</span>
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationPrevious
                  onClick={() => table.previousPage()}
                  className={
                    !table.getCanPreviousPage()
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {pageItems.map((p, idx) =>
                p === "..." ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={idx}>
                    <PaginationLink
                      onClick={() => table.setPageIndex(p - 1)}
                      href="#"
                      isActive={p - 1 === pageIndex}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => table.nextPage()}
                  className={
                    !table.getCanNextPage()
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              <PaginationItem>
                <PaginationLink
                  aria-label="Go to first page"
                  size="default"
                  className={`gap-1 px-2.5 sm:pl-2.5 ${
                    !table.getCanNextPage()
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                >
                  <span className="hidden sm:block">Last</span>
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
}
