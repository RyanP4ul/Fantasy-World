"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { fileSchema, FileSchema } from "@/validations/panel/uploadValidator";
import PanelLayout from "@/components/layout/panel-layout";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";
import { AlertCircleIcon, Loader2Icon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PanelSelectContent } from "@/components/panel-select-component";

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [paths, setPaths] = useState<string[]>([]);
  const [results, setResults] = useState<{ file: string; status: string }[]>(
    []
  );
  const [currentPath, setCurrentPath] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const coolDown = 2000;

  const form = useForm<FileSchema>({
    resolver: zodResolver(fileSchema),
    defaultValues: { files: [], paths: [] },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    // Append instead of replace
    const updatedFiles = [...files, ...newFiles];
    const updatedPaths = updatedFiles.map((f) => `${currentPath}/${f.name}`);

    setFiles(updatedFiles);
    setPaths(updatedPaths);
    setResults([]); // clear old results when selecting new files

    form.setValue("files", updatedFiles);
    form.setValue("paths", updatedPaths);
  };

  const handleRemove = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPaths = paths.filter((_, i) => i !== index);

    setFiles(updatedFiles);
    setPaths(updatedPaths);

    form.setValue("files", updatedFiles);
    form.setValue("paths", updatedPaths);
  };

  const onSubmit = async (data: FileSchema) => {
    setIsUploading(true);
    setResults([]);

    const formData = new FormData();
    data.files.forEach((file: any, i: number) => {
      formData.append("files", file);
      formData.append("paths", data.paths[i]);
    });

    const res = await fetch("/api/panel/upload", {
      method: "POST",
      body: formData,
    });
    const json = await res.json();

    if (json.success) {
      setResults(json.results); // show backend results
    } else {
      setResults([
        { file: "All files", status: json.message || "Upload failed" },
      ]);
    }

    setFiles([]);
    setPaths([]);

    form.reset();

    setTimeout(() => {
      setIsUploading(false);
    }, coolDown);
  };

  return (
    <PanelLayout entityName="Upload Files">
      <Card className="p-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">
            Upload Files
            <CardDescription>Upload your files here.</CardDescription>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {results.length > 0 && (
            <Alert variant="default" className="mb-4">
              <AlertCircleIcon />
              <AlertTitle>Upload Results</AlertTitle>
              <AlertDescription>
                <ul className="list-inside list-disc text-sm">
                  {results.map((r, i) => (
                    <li key={i}>
                      <span
                        className={
                          r.status.startsWith("✅")
                            ? "text-green-600"
                            : r.status.startsWith("❌")
                            ? "text-red-600"
                            : "text-yellow-600"
                        }
                      >
                        {r.file}: {r.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {files.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {files.map((file, i) => {
                    return (
                      <li key={i}>
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-12 md:col-span-2">
                            <Select
                              onValueChange={(value) => {
                                setPaths((prev) => {
                                  const updated = [...prev];
                                  updated.splice(i,1,value + "/" + files[i].name);
                                  form.setValue("paths", updated);
                                  return updated;
                                });

                              }}
                              defaultValue={
                                paths[i].indexOf(files[i].name) != -1
                                  ? paths[i].replace(`/${files[i].name}`, "")
                                  : paths[i]
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a file path" />
                              </SelectTrigger>
                              <PanelSelectContent />
                            </Select>
                          </div>
                          <div className="col-span-12 md:col-span-10">
                            <div className="flex items-center justify-between rounded-md h-9 border px-3 py-1 text-sm">
                              <span>
                                {file.name} → {paths[i]}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemove(i)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              {files.length > 0 && <Separator />}

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-2">
                  <FormItem>
                    <Select
                      onValueChange={(value) => setCurrentPath(value)}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a file path" />
                        </SelectTrigger>
                      </FormControl>
                      <PanelSelectContent />
                    </Select>
                    {currentPath.length < 1 && (
                      <FormDescription>
                        You must select a file path before uploading files.
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                </div>
                <div className="col-span-12 md:col-span-10">
                  <FormField
                    control={form.control}
                    name="files"
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            accept=".png,.jpg,.jpeg,.swf"
                            disabled={currentPath.length < 1}
                          />
                        </FormControl>
                        <FormDescription>
                          Only accept .png, .jpg, .jpeg, .swf files
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={
                  files.length === 0 || files.length > 10 || isUploading
                }
              >
                {isUploading ? (
                  <>
                    <Loader2Icon className="mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  `${files.length > 10 ? "Too many files selected only 10 is maximum. Make sure to remove some before uploading." : "Upload"} ${files.length > 0 ? `(${files.length})` : ""}`
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PanelLayout>
  );
}
