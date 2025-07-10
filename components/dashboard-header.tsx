"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, Target, CheckSquare, Settings, BarChart3 } from "lucide-react"
import Link from "next/link"

export function DashboardHeader() {
  const [showMenu, setShowMenu] = useState(false)

  const menuItems = [
    { icon: Target, label: "Goals", href: "/dashboard" },
    { icon: CheckSquare, label: "Daily Tasks", href: "/daily-tasks" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SG</span>
            </div>
            <span className="font-semibold text-lg">SetGoals</span>
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <Button variant="ghost" size="sm" onClick={() => setShowMenu(true)}>
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <Dialog open={showMenu} onOpenChange={setShowMenu}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Navigation</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            {menuItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="justify-start h-12"
                asChild
                onClick={() => setShowMenu(false)}
              >
                <Link href={item.href}>
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
