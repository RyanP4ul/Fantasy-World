"use client";

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import WebLayout from "@/components/layout/web-layout";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, Link, Loader2Icon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ReCAPTCHA from "react-google-recaptcha";
import { zAlphanumeric } from "@/validations/validation";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { registerSchema } from "@/validations/authValidator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Page() {
  const router = useRouter();
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const GOOGLE_RECAPTCHA_SITE_KEY =
    process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY;

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleError = async (res: Response) => {
    const response = await res.json();
    if (typeof response === "string") {
      setError(response || "Unknown error");
    } else {
      type ErrorResponse = { errors?: Record<string, string> };
      const errData: ErrorResponse = response;
      if (errData.errors) {
        Object.entries(errData.errors).forEach(([field, message]) => {
          form.setError(field as any, { message });
        });
      }
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setIsLoading(true);

    if (!captchaValue) {
      setError("Please complete the reCAPTCHA.");
      setIsLoading(false);
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, captcha: captchaValue }),
    });

    if (res?.ok) {
      router.push("/");
    } else {
      await handleError(res);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <WebLayout>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Register a new account</CardTitle>
                <CardDescription>
                  Enter your details below to create a new account
                </CardDescription>
                {error && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircleIcon />
                    <AlertDescription>
                      <p>{error}</p>
                    </AlertDescription>
                  </Alert>
                )}
              </CardHeader>
              <CardContent>
                <FormProvider {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter your username"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormDescription>
                            Only accepts letters and numbers and white space
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter your password"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="retype_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Retype Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Retype your password"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="M">Male</SelectItem>
                              <SelectItem value="F">Female</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <ReCAPTCHA
                      sitekey={GOOGLE_RECAPTCHA_SITE_KEY || ""}
                      onChange={(value: any) => setCaptchaValue(value)}
                    />

                    <Separator className="mt-3 mb-5" />
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="outline"
                        className="cursor-pointer"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2Icon className="mr-2 animate-spin h-4 w-4" />
                            Registering...
                          </>
                        ) : (
                          "Register"
                        )}
                      </Button>
                    </div>
                  </form>
                </FormProvider>
                {/* <form
                        </>
                      ) : (
                        "Register"
                      )}
                    </Button>

                    </div>
                  </form>
                </FormProvider>
                {/* <form
                    onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-6"
                >
                  <div className="grid gap-3">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="username"
                      placeholder="Enter your username"
                      {...form.register("username")}
                    />
                    {form.formState.errors.username && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      {...form.register("password")}
                    />
                    {form.formState.errors.password && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="retype_password">Retype Password</Label>
                    <Input
                      id="retype_password"
                      type="password"
                      placeholder="Retype your password"
                      {...form.register("retype_password")}
                    />
                    {form.formState.errors.retype_password && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.retype_password.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <ReCAPTCHA
                    sitekey={GOOGLE_RECAPTCHA_SITE_KEY || ""}
                    onChange={(value: any) => setCaptchaValue(value)}
                  />

                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      className="w-full"
                      variant="outline"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        "Register"
                      )}
                    </Button>
                  </div>

                  <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <a href="/login" className="underline underline-offset-4">
                      Login
                    </a>
                  </div>
                </form> */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WebLayout>
  );
}
