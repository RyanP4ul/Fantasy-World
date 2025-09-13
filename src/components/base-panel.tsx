"use client";

import React, { JSX, Suspense, use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Loader2Icon, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PanelDataTable from "@/components/panel-data";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "./ui/checkbox";
import PanelLayout from "./layout/panel-layout";
import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { panel_logs } from "@/db/schema";
import { db } from "@/db";
import { isView } from "drizzle-orm";
import { de } from "date-fns/locale";
// import { useSearchParams } from "next/navigation";

interface BasePanelProps<T> {
  entityName: string;
  description: string;
  table: string;
  searchName: string;
  schema?: z.ZodObject<any>;
  apiEndpoint: string;
  columns: ColumnDef<unknown>[];
  defaultValues?: Partial<T>;
  viewOnly?: boolean;
  renderFormFields?: (form: any) => JSX.Element;
}

export default function BasePanel<T>({
  entityName,
  description,
  table,
  searchName,
  schema = z.object({}),
  apiEndpoint,
  columns,
  defaultValues = {},
  renderFormFields = () => <></>,
  viewOnly = false,
}: BasePanelProps<T>) {

  const [data, setData] = useState<T[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [action, setAction] = useState<"none" | "edit" | "insert" | "delete">("none");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  type FormValues = z.infer<typeof schema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const { isFetching, error } = useQuery({
    queryKey: ["table"],
    queryFn: async () => {
      const res = await fetch(apiEndpoint);
      if (!res.ok) {
        throw new Error("Error fetching table data");
      }

      const jsonData = await res.json();

      setData(jsonData);

      // Check for "edit" param in URL to open modal automatically
      // if (searchParams.has("edit")) {
      //   const id = searchParams.get("edit");
      //   if (id) {
      //     const item = jsonData.find((item: any) => item.id === Number(id));

      //     if (item) {
      //       setId(Number(id));
      //       setAction("edit");
      //       setIsModalOpen(true);
      //       form.reset(item);
      //     }
      //   }
      // }

      return true;
    },
  });

  async function panelLogs(
    userId: number,
    action: string,
    description: string
  ) {
    await fetch("/api/panel/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, action, description }),
    });
  }

  const handleError = async (res: Response) => {
    const response = await res.json();
    if (typeof response === "string") {
      toast.error(response || "Unknown error");
    } else {
      type ErrorResponse = { errors?: Record<string, string> };
      const errData: ErrorResponse = response;
      if (errData.errors) {
        Object.entries(errData.errors).forEach(([field, message]) => {
          form.setError(field as any, { message });
        });
      }
    }
  };

  const handleAddNewItem = () => {
    form.reset(defaultValues);
    handleNextId();
    setIsModalOpen(true);
    setAction("insert");
  };

  const handleSubmit = async (data: FormValues) => {
    setIsActionLoading(true);
    try {
      const url = action === "edit" ? `${apiEndpoint}/${id}` : apiEndpoint;
      const method = action === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        // const jsonData = await res.json();
        if (action === "edit") {
          setData((prevData) =>
            prevData.map((item: any) => (item.id === id ? data : item))
          );
        } else {
          data.oldId = data.id;
          setData((prevData) => [data as T, ...prevData]);
        }

        const userId = Number(session?.user?.id) || 0;
        panelLogs(
          userId,
          action,
          `${
            action === "edit" ? "Updated" : "Created"
          } ${entityName.toLowerCase()} with id ${data.id}`
        );

        toast.success(
          `${entityName} ${
            action === "edit" ? "updated" : "created"
          } successfully`
        );
        setIsModalOpen(false);
      } else {
        await handleError(res);
      }
    } catch (error) {
      toast.error(
        `Error ${
          action === "edit" ? "updating" : "creating"
        } ${entityName.toLowerCase()}: ${error || ""}`
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleNextId = async () => {
    const res = await fetch(`/api/next-id/${table}`);
    if (res.ok) {
      form.setValue("id" as any, Number(await res.json()));
    }
  };

  const handleDelete = async () => {
    setIsActionLoading(true);
    try {
      const res = await fetch(`${apiEndpoint}/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setData((prevData) => prevData.filter((item: any) => item.id !== id));
        setIsModalOpen(false);

        const userId = Number(session?.user?.id) || 0;
        panelLogs(
          userId,
          action,
          `Deleted ${entityName.toLowerCase()} with id ${id}`
        );

        toast.success(`${entityName} deleted successfully`);
      } else {
        await handleError(res);
      }
    } catch {
      toast.error(`Error deleting ${entityName.toLowerCase()}`);
    } finally {
      setIsActionLoading(false);
    }
  };

  const onSubmit = (data: FormValues) => {
    console.log("✅ Submitted Data:", data);
  };

  const onError = (err: any) => {
    console.error("❌ Validation Errors:", err);
  };

  const renderForm = () => {
    // form.reset(defaultValues);

    return (
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit, onError)}
          className="space-y-4"
        >
          <Separator className="mb-2" />

          <input
            type="hidden"
            value={action === "edit" ? Number(form.getValues("id")) : 0}
            {...form.register("oldId")}
          />
          <ScrollArea className="max-h-[70vh] overflow-auto p-2">
            {renderFormFields(form)}
          </ScrollArea>
          <Separator className="mt-3 mb-5" />
          <div className="flex justify-between mt-4">
            <div className="flex gap-2">
              <DialogTrigger asChild>
                <Button className="cursor-pointer" variant="outline">
                  Close
                </Button>
              </DialogTrigger>
              <Button
                type="button"
                variant="secondary"
                className="cursor-pointer"
                onClick={async () => {
                  form.reset(defaultValues);

                  // only reset if insert since the edit action already have id
                  if (action == "insert") {
                    await handleNextId();
                  }
                }}
              >
                Reset
              </Button>
            </div>

            <Button
              type="submit"
              variant="outline"
              className="cursor-pointer"
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <>
                  <Loader2Icon className="mr-2 animate-spin h-4 w-4" />
                  Loading...
                </>
              ) : (
                <>{action === "edit" ? "Update" : "Create"}</>
              )}
            </Button>
          </div>

          {/* <DialogFooter>
            <div className="flex justify-between items-center">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="outline"
                className="cursor-pointer"
                disabled={isActionLoading}
              >
                {isActionLoading ? (
                  <>
                    <Loader2Icon className="mr-2 animate-spin h-4 w-4" />
                    Loading...
                  </>
                ) : (
                  <>{action === "edit" ? "Update" : "Create"}</>
                )}
              </Button>
            </div>

            <div className="flex justify-start">
              
            </div>

            <div className="flex justify-end">
              
            </div>
          </DialogFooter> */}
          {/* <div className="flex justify-end relative">
            <Button
              type="submit"
              variant="outline"
              className="cursor-pointer"
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <>
                  <Loader2Icon className="mr-2 animate-spin h-4 w-4" />
                  Loading...
                </>
              ) : (
                <>{action === "edit" ? "Update" : "Create"}</>
              )}
            </Button>
          </div> */}
        </form>
      </FormProvider>
    );
  };

  const renderDelete = () => (
    <div className="flex justify-end">
      <Button
        variant="destructive"
        className="cursor-pointer"
        onClick={handleDelete}
        disabled={isActionLoading}
      >
        {isActionLoading ? (
          <>
            <Loader2Icon className="mr-2 animate-spin h-4 w-4" />
            Deleting...
          </>
        ) : (
          "Delete"
        )}
      </Button>
    </div>
  );

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
    ...columns,
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
            setAction("edit");
            setId(row.original.id);
            setIsModalOpen(true);
            form.reset(row.original);
          }}
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setAction("delete");
            setId(row.original.id);
            setIsModalOpen(true);
          }}
          className="text-destructive hover:text-destructive cursor-pointer"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    ),
  };

  return (
    <PanelLayout entityName={entityName}>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Card className="flex">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">
              {entityName}
              {description && <CardDescription>{description}</CardDescription>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="flex flex-col items-center justify-center">
                <div className="mx-auto max-w-md text-center">
                  <div className="mx-auto h-12 w-12 text-primary" />
                  <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Error
                  </h1>
                  <p className="mt-4 text-muted-foreground">
                    {error.message || "An error occurred"}
                  </p>
                </div>
              </div>
            ) : (
              <PanelDataTable
                data={data}
                searchName={searchName}
                isFetching={isFetching}
                columns={
                  viewOnly ? relative_col : [...relative_col, column_actions]
                }
                handleAddNewItem={viewOnly ? null : handleAddNewItem}
              />
            )}
          </CardContent>
        </Card>
        <DialogContent className="w-full max-w-[95vw] sm:max-w-xl md:max-w-2xl lg:max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            {action === "insert" ? (
              <>
                <DialogTitle>Create new {entityName.toLowerCase()}</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new {entityName.toLowerCase()}
                  .
                </DialogDescription>
              </>
            ) : action === "delete" ? (
              <>
                <DialogTitle>Delete {entityName.toLowerCase()}</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this{" "}
                  {entityName.toLowerCase()}?
                </DialogDescription>
              </>
            ) : (
              <>
                <DialogTitle>Edit {entityName.toLowerCase()}</DialogTitle>
                <DialogDescription>
                  Modify the details of the {entityName.toLowerCase()}.
                </DialogDescription>
              </>
            )}
          </DialogHeader>
          {
            {
              none: "",
              edit: renderForm(),
              insert: renderForm(),
              delete: renderDelete(),
            }[action]
          }
        </DialogContent>
      </Dialog>
    </PanelLayout>
  );
}
