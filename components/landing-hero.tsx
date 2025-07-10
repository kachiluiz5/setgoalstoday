"use client"
import { Button } from "@/components/ui/button"
import { Star, Target } from "lucide-react"
import Link from "next/link"
import { TypeAnimation } from "@/components/type-animation"

const GOAL_EXAMPLES = [
  "learn graphic design",
  "save $10,000",
  "run a marathon",
  "launch my business",
  "master coding",
  "quit smoking",
  "write a novel",
  "meditate daily",
]

export function LandingHero() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center">
            <Target className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-xl text-black">SetGoals</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="/dashboard" className="text-gray-600 hover:text-black font-medium transition-colors">
            Dashboard
          </Link>
          <Link href="/notes" className="text-gray-600 hover:text-black font-medium transition-colors">
            Notes
          </Link>
        </div>

        <Link href="/dashboard">
          <Button className="rounded-full px-6 bg-black hover:bg-gray-800 text-white font-medium">Get Started</Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-8 py-32 max-w-5xl mx-auto text-center">
        <div className="space-y-12">
          {/* Rating Badge */}
          <div className="flex items-center justify-center space-x-2">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
              ))}
            </div>
            <span className="text-sm text-gray-600 font-medium">Rated 5 stars from 10,000+ users</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-black leading-[0.9] tracking-tight">
              Find Your Path to{" "}
              <span className="relative inline-block">
                <span className="text-blue-600">Success</span>
                <div className="absolute -top-3 -right-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center rotate-12">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                </div>
              </span>
            </h1>

            <div className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto font-medium">
              My goal is to{" "}
              <span className="text-black font-semibold">
                <TypeAnimation phrases={GOAL_EXAMPLES} />
              </span>
            </div>

            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-normal">
              Get AI-powered roadmaps, track your progress, and achieve any goal with personalized guidance.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="rounded-full px-10 py-6 text-lg bg-black hover:bg-gray-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Target className="h-6 w-6 mr-3" />
                Set Your Goal
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
