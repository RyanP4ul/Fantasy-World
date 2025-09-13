"use client";

import Link from "next/link";
import { AppSidebar } from "../app-sidebar";
import { SiteHeader } from "../site-header";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "../ui/breadcrumb";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import Head from "next/head";

export default function PanelLayout({
  entityName,
  children,
}: {
  entityName: string;
  children: React.ReactNode;
}) {
  return (
    <>
    
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col m-5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/panel">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{entityName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
            <footer className="w-full border-t">
              <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col items-center">
                  <p className="text-sm text-muted-foreground">
                    © 2025 SuckMeLator. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </>
  );
}
