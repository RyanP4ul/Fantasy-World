"use client";

import { use, useEffect, useState } from "react";
import WebLayout from "@/components/layout/web-layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { FormProvider, useForm } from "react-hook-form";
import z, { set } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ReCAPTCHA from "react-google-recaptcha";
import { Separator } from "@/components/ui/separator";
import { changePasswordSchema } from "@/validations/authValidator";
import { useSession } from "next-auth/react";
import { IconBrandDiscord } from "@tabler/icons-react";
import DiscordIntegration from "@/components/web/account/discord";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type RegisterFormData = z.infer<typeof changePasswordSchema>;

export default function Account() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const { data: session } = useSession();
  const [data, setData] = useState<any>();
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    setIsFetching(true);

    const fetchData = async () => {
      setIsFetching(true);
      const res = await fetch(`/api/auth/account/${session?.user.id}`);
      if (res.ok) {
        const data = await res.json();
        setData(data);
      }
      setIsFetching(false);
    };

    if (session) {
      fetchData();
      setIsFetching(false);
    }
  }, [session]);

  // const { data, isFetching } = useQuery({
  //   queryKey: ["user"],
  //   queryFn: async () => {
  //     let repeat = false;
  //     while (!repeat && session) {
  //       const res = await fetch(`/api/auth/account/${session?.user.id}`);
  //       if (res.ok) {
  //         const data = await res.json();
  //         repeat = true;
  //         return data;
  //       }
  //     }
  //   },
  // });

  const GOOGLE_RECAPTCHA_SITE_KEY =
    process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY;
  const [message, setMessage] = useState<Record<string, string | null>>({});
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleError = async (res: Response) => {
    const response = await res.json();
    if (typeof response === "string") {
      setMessage({ error: response || "Unknown error" });
    } else {
      type ErrorResponse = { errors?: Record<string, string> };
      const errData: ErrorResponse = response;
      if (errData.errors) {
        Object.entries(errData.errors).forEach(([field, message]) => {
          form.setError(field as any, { message });
        });
      }
    }

    setIsLoading(false);
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    if (!session) {
      setMessage({ error: "User not authenticated" });
      return;
    }

    const res = await fetch(`/api/auth/change-password/${session.user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      await handleError(res);
      return;
    }

    setMessage({ success: "Password updated successfully" });

    setTimeout(() => {
      form.reset();
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="px-6 py-6 mt-50">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-3">
          <Card>
            <div className="shadow-lg sticky">
              <div className="text-center">
                <div className="w-50 h-50 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                  <img
                    alt="Character Avatar"
                    className="w-full h-full rounded-full object-cover"
                    src={
                      data?.DiscordID
                        ? `https://cdn.discordapp.com/avatars/${data.DiscordID}/${data.DiscordAvatar}.png`
                        : "/assets/images/default-avatar.jpg"
                    }
                  />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {data?.Name || ""}
                </h3>
                <p className="text-gray-400">Level {data?.Level || 0}</p>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-span-12 md:col-span-8">
          <Tabs defaultValue="account">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="connect">Connect</TabsTrigger>
              <TabsTrigger value="transaction">Transaction</TabsTrigger>
            </TabsList>

            {error && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>{error}</AlertTitle>
              </Alert>
            )}

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    You can see your account information here.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  {isFetching ? (
                    <>
                      <div className="grid gap-3">
                        <Skeleton className="h-3 w-[100px]" />
                        <Skeleton className="h-9 w-full" />
                      </div>
                      <div className="grid gap-3">
                        <Skeleton className="h-3 w-[100px]" />
                        <Skeleton className="h-9 w-full" />
                      </div>
                      <div className="grid gap-3">
                        <Skeleton className="h-3 w-[100px]" />
                        <Skeleton className="h-9 w-full" />
                      </div>
                      <div className="grid gap-3">
                        <Skeleton className="h-3 w-[100px]" />
                        <Skeleton className="h-9 w-full" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid gap-3">
                        <Label>Name</Label>
                        <Input
                          id="tabs-demo-name"
                          defaultValue={data?.Name || ""}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label>Email</Label>
                        <Input
                          id="tabs-demo-email"
                          defaultValue={data?.Email || ""}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="lastArea">LastArea</Label>
                        <Input
                          type="lastArea"
                          id="lastArea"
                          defaultValue={data?.LastArea || "unknown"}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="dateCreated">Date Created</Label>
                        <Input
                          type="dateCreated"
                          id="dateCreated"
                          defaultValue={
                            data?.DateCreated
                              ? format(data.DateCreated, "yyyy-MM-dd")
                              : ""
                          }
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password here.</CardDescription>
                </CardHeader>
                <FormProvider {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="grid gap-6">
                      {message.error ||
                        (message.success && (
                          <Alert
                            variant={message.error ? "destructive" : "default"}
                          >
                            <AlertCircleIcon />
                            <AlertDescription>
                              <p className="text-white">
                                {message.error || message.success}
                              </p>
                            </AlertDescription>
                          </Alert>
                        ))}
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="current_password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Enter your current password"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Your current password is required to change your
                                password.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="new_password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Enter your new password"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Your new password must not be less than 30
                                characters long and contain at least one
                                uppercase letter, one lowercase letter, and one
                                number.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="confirm_password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm New Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Enter your confirm password"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <ReCAPTCHA
                        sitekey={GOOGLE_RECAPTCHA_SITE_KEY || ""}
                        onChange={(value: any) =>
                          form.setValue("captcha", value)
                        }
                      />

                      <FormField
                        control={form.control}
                        name="captcha"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="hidden"
                                placeholder="Captcha value"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Separator className="mt-3 mb-5" />
                      <div className="flex justify-end">
                        <Button
                          variant="default"
                          className="cursor-pointer"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Save password"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </form>
                </FormProvider>
              </Card>
            </TabsContent>
            <TabsContent value="connect">
              <Card>
                <CardHeader>
                  <CardTitle>Discord Integration</CardTitle>
                  <CardDescription>
                    You can connect your Discord account here.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <DiscordIntegration discordId={data?.DiscordID} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="transaction">
              <h1>Transaction</h1>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
