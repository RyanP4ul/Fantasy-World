"use client";

import PanelLayout from "@/components/layout/panel-layout";
import { PanelInput } from "@/components/panel-controls";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  WebSettingFormData,
  webSettingSchema,
} from "@/validations/panel/webSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon, SettingsIcon } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<WebSettingFormData>({
    resolver: zodResolver(webSettingSchema),
    defaultValues: {
      MaxRegisterPerDay: 5,
      MaxAccountPerIp: 1,
      CanRegister: true,
      IsMaintenance: false,
      IsStaffOnly: false,
    },
  });

  const onSubmit = async (data: WebSettingFormData) => {
    const res = await fetch("/api/panel/web/settings", {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      toast.error("Failed to update settings");
      return;
    }

    toast.success("Settings updated successfully");
  };

  const { data, isFetching } = useQuery({
    queryKey: ["webSettings"],
    queryFn: async () => {
      const res = await fetch("/api/panel/web/settings");
      const data = await res.json();

      form.setValue("MaxRegisterPerDay", Number(data.MaxRegisterPerDay));
      form.setValue("MaxAccountPerIp", Number(data.MaxAccountPerIp));
      form.setValue("CanRegister", data.CanRegister);
      form.setValue("IsMaintenance", data.IsMaintenance);
      form.setValue("IsStaffOnly", data.IsStaffOnly);

      return data;
    },
  });

  return (
    <PanelLayout entityName="Web Settings">
      <Card className="bg-card/50 backdrop-blur-sm border border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            General Settings
          </CardTitle>
          <CardDescription>Basic server configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <PanelInput
                    control={form.control}
                    name="MaxRegisterPerDay"
                    type="number"
                    label="MaxRegisterPerDay"
                    placeholder="MaxRegisterPerDay"
                    description="The maximum number of registrations allowed per day"
                  />
                </div>
                <div>
                  <PanelInput
                    control={form.control}
                    name="MaxAccountPerIp"
                    type="number"
                    label="Max Account Per Ip Address"
                    placeholder="Max Account Per Ip Address"
                    description="The maximum number of accounts allowed per IP address"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="CanRegister"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Enable Registration</FormLabel>
                        <FormDescription>
                          Allow new users to register accounts
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading || isFetching}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="IsMaintenance"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Maintenance Mode</FormLabel>
                        <FormDescription>
                          Temporarily disable access to the server
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading || isFetching}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="IsStaffOnly"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Staff Only</FormLabel>
                        <FormDescription>
                          Restrict access to staff members only
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading || isFetching}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full cursor-pointer"
                    disabled={isLoading || isFetching}
                  >
                    {isLoading || isFetching ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        Save...
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </PanelLayout>
  );
}
