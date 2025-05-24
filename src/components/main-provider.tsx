'use client'
import React from "react"
import { ThemeProvider } from "./theme-provider"
import { SidebarProvider, SidebarInset } from "./ui/sidebar"
import { AppSidebar } from "./dashboard/app-sidebar"
import { Toaster } from "sonner"
import { SiteHeader } from "./dashboard/site-header"


export default function MainProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}>

        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader title="Beerpongturnier" />
          {children}
        </SidebarInset>
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  )
}

