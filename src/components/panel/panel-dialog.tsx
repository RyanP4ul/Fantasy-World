"use client";

import { usePanel } from "@/providers/PanelProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";

type PanelDialogProps = {
  tableName: string;
  renderFormFields: (form: any) => React.ReactNode;
};

export function PanelDialog({ tableName, renderFormFields }: PanelDialogProps) {
  const { panelForm } = usePanel();

  const renderForm = () => (
    <FormProvider {...panelForm.form}>
      <form
        onSubmit={panelForm.form.handleSubmit(
          panelForm.handleSubmit,
          (err: any) => {
            console.error("❌ Validation Errors:", err);
          }
        )}
        className="space-y-4"
      >
        <Separator className="mb-2" />
        <input
            type="hidden"
            value={panelForm.action === "edit" ? Number(panelForm.form.getValues("id")) : 0}
            {...panelForm.form.register("oldId")}
          />
        <ScrollArea className="max-h-[70vh] overflow-auto p-2">
          {renderFormFields(panelForm.form)}
        </ScrollArea>
        <Separator className="mt-3 mb-5" />

        <div className="flex justify-between mt-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => panelForm.setIsModalOpen(false)}
            >
              Close
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="cursor-pointer"
              onClick={async () => panelForm.handleResetForm()}
            >
              Reset
            </Button>
          </div>

          <Button
            type="submit"
            variant="outline"
            disabled={panelForm.isActionLoading}
            className="cursor-pointer"
          >
            {panelForm.isActionLoading ? (
              <>
                <Loader2Icon className="mr-2 animate-spin h-4 w-4" />
                Loading...
              </>
            ) : (
              <>{panelForm.action === "edit" ? "Update" : "Create"}</>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );

  const renderDelete = () => (
    <div className="flex justify-end">
      <Button
        variant="destructive"
        onClick={async () => panelForm.handleDelete()}
        disabled={panelForm.isActionLoading}
        className="cursor-pointer"
      >
        {panelForm.isActionLoading ? (
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

  return (
    <Dialog
      open={panelForm.isModalOpen}
      onOpenChange={panelForm.setIsModalOpen}
    >
      <DialogContent className="w-full max-w-[95vw] sm:max-w-xl md:max-w-2xl lg:max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          {panelForm.action === "insert" && (
            <>
              <DialogTitle>Create new {tableName.toLowerCase()}</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new {tableName.toLowerCase()}.
              </DialogDescription>
            </>
          )}
          {panelForm.action === "edit" && (
            <>
              <DialogTitle>Edit {tableName.toLowerCase()}</DialogTitle>
              <DialogDescription>
                Modify the details of the {tableName.toLowerCase()}.
              </DialogDescription>
            </>
          )}
          {panelForm.action === "delete" && (
            <>
              <DialogTitle>Delete {tableName.toLowerCase()}</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this {tableName.toLowerCase()}?
              </DialogDescription>
            </>
          )}
        </DialogHeader>

        {panelForm.action === "delete"
          ? renderDelete()
          : panelForm.action !== "none" && renderForm()}
      </DialogContent>
    </Dialog>
  );
}
