"use client"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function FloatingNoteButton() {
  const pathname = usePathname()

  // Don't show on landing page or notes page
  if (pathname === "/" || pathname === "/notes") {
    return null
  }

  return (
    <div className="fixed bottom-20 right-6 z-50">
      <Link href="/notes">
        <Button
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <FileText className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  )
}
