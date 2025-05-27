"use client"

import type React from "react"
import { useState } from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Nexus Command Center - Incident Management Platform</title>
        <meta name="description" content="Real-time incident management and alert correlation platform" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="relative min-h-screen bg-white">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex flex-col pl-0 md:pl-64">
              <Header onMenuClick={() => setSidebarOpen(true)} />
              <main className="flex-1 p-4 md:p-6 mt-16">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
