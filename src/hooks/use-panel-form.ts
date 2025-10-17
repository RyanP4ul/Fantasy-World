import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export function usePanelForm<T>(
  table: string,
  schema: z.ZodObject<any>,
  url: string,
  defaultValues: Partial<T>
) {
  const [data, setData] = React.useState<T[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [action, setAction] = React.useState<
    "none" | "insert" | "edit" | "delete"
  >("none");
  const [isActionLoading, setIsActionLoading] = React.useState<boolean>(false);
  const [id, setId] = React.useState<number>(-1);

  type FormValues = z.infer<typeof schema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const handleNextId = async () => {
    const res = await fetch(`/api/next-id/${table}`);
    if (res.ok) {
      form.setValue("id" as any, Number(await res.json()));
    }
  };

  const handleResetForm = async () => {
    form.reset(defaultValues);

    if (action == "insert") {
      await handleNextId();
    }
  };

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

  const handleItemEdit = (item : any) => {
    console.log(item);
    setAction("edit");
    setId(item.id);
    setIsModalOpen(true);
    form.reset(item);
  };

  const handleItemDelete = (item: any) => {
    setAction("delete");
    setId(item.id);
    setIsModalOpen(true);
  }

  const handleSubmit = async (values: FormValues) => {
    setIsActionLoading(true);

    console.log(`Submit id: ${id} action: ${action} `);

    try {
      const requestUrl = action === "edit" ? `${url}/${id}` : url;
      console.log(`Request URL: ${requestUrl}`);
      const method = action === "edit" ? "PUT" : "POST";

      const res = await fetch(requestUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        if (action === "edit") {

          setData((prevData) =>
            prevData.map((item: any) => (item.id === id ? values : item))
          );
        } else {
          values.oldId = values.id;
          setData((prevData) => [data as T, ...prevData]);
        }

        toast.success(
          `${action === "edit" ? "Updated" : "Created"} successfully`
        );
        setIsModalOpen(false);
      } else {
        await handleError(res);
      }
    } catch (error) {
      toast.error(
        `Error ${action === "edit" ? "Updating" : "Creating"}: ${error || ""}`
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsActionLoading(true);

    try {
      const res = await fetch(`${url}/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setData((prevData) => prevData.filter((item: any) => item.id !== id));
        setIsModalOpen(false);
        toast.success(`Deleted successfully`);
      } else {
        await handleError(res);
      }
    } catch {
      toast.error(`Error deleting!`);
    } finally {
      setIsActionLoading(false);
    }
  };

  return {
    data,
    form,
    setData,
    isModalOpen,
    setIsModalOpen,
    isActionLoading,
    action,
    setAction,
    handleAddNewItem,
    handleItemEdit,
    handleItemDelete,
    handleSubmit,
    handleDelete,
    handleResetForm,
  };
}
