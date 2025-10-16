"use client";

import PanelLayout from "@/components/layout/panel-layout";

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
import React from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { description } from "../panel-visitors-charts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ChevronDown, Edit, Loader2Icon, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  faChevronLeft,
  faChevronRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type Props<T> = {
  children?: React.ReactNode;
  pageName: string;
  url: string;
  columns: ColumnDef<T>[];
};

export default function TestBasePanel<T>({
  children,
  pageName,
  url,
  columns,
}: Props<T>) {
    
  const [data, setData] = React.useState<T[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [columnFilters, setColumnFilters] = React.useState<any[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const [action, setAction] = React.useState<"none" | "insert" | "edit" | "delete" | null>(null);
  const pageSize = 10;

  React.useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      const res = await fetch(`${url}?page=${pageIndex + 1}&limit=${pageSize}`);
      const json = await res.json();
      setData(json.data);
      setTotal(json.total);
      setIsFetching(false);
    };
    fetchData();
  }, [pageIndex]);

  const relative_col = [
    {
      id: "select",
      header: ({ table }: { table: any }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }: { row: any }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const column_actions = {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: { original: any } }) => (
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => {
            // setAction("edit");
            // setId(row.original.id);
            // setIsModalOpen(true);
            // form.reset(row.original);
          }}
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // setAction("delete");
            // setId(row.original.id);
            // setIsModalOpen(true);
          }}
          className="text-destructive hover:text-destructive cursor-pointer"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    ),
  };

  const allColumns = [...relative_col, ...columns, column_actions as any];

  const table = useReactTable({
    data,
    columns: allColumns,
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
      const newPage =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newPage.pageIndex);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <PanelLayout entityName={pageName}>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Card className="flex">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">
              {pageName}
              {description && <CardDescription>{description}</CardDescription>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center py-4">
              <Input
                placeholder="Search..."
                disabled={isFetching}
                value={
                  (table.getColumn("Name")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("Name")?.setFilterValue(event.target.value)
                }
                className="max-w-md"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="cursor-pointer ml-auto"
                    disabled={isFetching}
                  >
                    Columns <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="cursor-pointer capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer ml-2"
                //   onClick={handleAddNewItem}
                disabled={isFetching}
              >
                <FontAwesomeIcon icon={faPlus} />
                Add New Items
              </Button>
            </div>
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
            <div className="flex items-center justify-between px-4">
              <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
              <div className="flex w-full items-center gap-8 lg:w-fit mt-5">
                <div className="flex w-fit items-center justify-center text-sm font-medium">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </div>
                <div className="ml-auto flex items-center gap-2 lg:ml-0">
                  <Button
                    variant="outline"
                    className="hidden h-8 w-12 p-0 lg:flex"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to first page</span>
                    <div className="absolute">
                      <FontAwesomeIcon icon={faChevronLeft} />
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="size-8"
                    size="icon"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to previous page</span>
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </Button>
                  <Button
                    variant="outline"
                    className="size-8"
                    size="icon"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to next page</span>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </Button>
                  <Button
                    variant="outline"
                    className="hidden size-8 w-12 lg:flex"
                    size="icon"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to last page</span>
                    <div className="absolute">
                      <FontAwesomeIcon icon={faChevronRight} />
                      <FontAwesomeIcon icon={faChevronRight} />
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <DialogContent className="w-full max-w-[95vw] sm:max-w-xl md:max-w-2xl lg:max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>Test</DialogHeader>
        </DialogContent>
      </Dialog>
    </PanelLayout>
  );
}
