"use client";

import { Suspense, useState } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import WebLayout from "@/components/layout/web-layout";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, X } from "lucide-react";
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
import { loginSchema } from "@/validations/authValidator";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const GOOGLE_RECAPTCHA_SITE_KEY =
    process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY;

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (error) {
    form.setError("username", {
      type: "manual",
      message: error,
    });
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    if (session) {
      form.setError("username", {
        type: "manual",
        message: "You are already logged in",
      });
      redirect("/");
      return;
    }

    if (!captchaValue) {
      form.setError("username", {
        type: "manual",
        message: "Please complete the CAPTCHA",
      });
      setIsLoading(false);
      return;
    }

    const res = await signIn("credentials", {
      username: data.username,
      password: data.password,
      captcha: captchaValue,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/");
    } else {
      form.setError("username", {
        type: "manual",
        message: "Invalid credentials",
      });
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your username below to login to your account
              </CardDescription>
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

                  <ReCAPTCHA
                    sitekey={GOOGLE_RECAPTCHA_SITE_KEY || ""}
                    onChange={(value: any) => setCaptchaValue(value)}
                  />

                  <Separator className="mt-3 mb-5" />
                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      className="w-full cursor-pointer"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full cursor-pointer"
                      onClick={() => {
                        setIsLoading(true);
                        signIn("discord");
                      }}
                      disabled={isLoading}
                    >
                      Login with Discord
                    </Button>
                  </div>

                  <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <a
                      href="/register"
                      className="underline underline-offset-4"
                    >
                      Register
                    </a>
                  </div>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
