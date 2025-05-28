"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <div className="flex flex-1 flex-col md:pl-[60px] lg:pl-[260px]">
        <Header />
        <main className="flex-1 pt-16">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
