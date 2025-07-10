"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Target, CheckSquare, Settings } from "lucide-react"
import Link from "next/link"

export function QuickAccessFab() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {/* Main FAB Button */}
        <Button
          size="lg"
          className={`h-16 w-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-500 transform ${
            isOpen ? "rotate-45 scale-110" : "rotate-0 scale-100"
          }`}
          onClick={toggleMenu}
        >
          <div className={`transition-all duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`}>
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div className={`absolute transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}>
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
        </Button>
      </div>

      {/* Menu Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-52 p-0 gap-0 fixed bottom-24 right-6 top-auto left-auto translate-x-0 translate-y-0 animate-in slide-in-from-bottom-2 duration-300 [&>button]:hidden">
          <DialogTitle className="sr-only">Quick Actions Menu</DialogTitle>
          <DialogDescription className="sr-only">
            Quick access to create goals, manage tasks, and access settings
          </DialogDescription>
          <Card className="shadow-xl border-0">
            <CardContent className="p-3">
              <div className="space-y-2">
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-14 text-left hover:bg-primary/10 transition-colors"
                  >
                    <Target className="mr-4 h-6 w-6 text-foreground" />
                    <div>
                      <div className="font-medium">Goals</div>
                      <div className="text-xs text-muted-foreground">Create and manage goals</div>
                    </div>
                  </Button>
                </Link>

                <Link href="/daily-tasks" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-14 text-left hover:bg-primary/10 transition-colors"
                  >
                    <CheckSquare className="mr-4 h-6 w-6 text-foreground" />
                    <div>
                      <div className="font-medium">Daily Tasks</div>
                      <div className="text-xs text-muted-foreground">Manage daily tasks</div>
                    </div>
                  </Button>
                </Link>

                <Link href="/settings" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-14 text-left hover:bg-primary/10 transition-colors"
                  >
                    <Settings className="mr-4 h-6 w-6 text-foreground" />
                    <div>
                      <div className="font-medium">Settings</div>
                      <div className="text-xs text-muted-foreground">App preferences</div>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  )
}
