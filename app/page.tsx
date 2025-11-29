"use client"

import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Causes from "@/components/causes"
import Impacts from "@/components/impacts"
import Calculator from "@/components/calculator"
import Minigame from "@/components/minigame"
import Myths from "@/components/myths"
import Quiz from "@/components/quiz"
import Quit from "@/components/quit"
import Testimonials from "@/components/testimonials"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <Hero />
      <Causes />
      <Impacts />
      <Calculator />
      <Minigame />
      <Myths />
      <Testimonials />
      <Quiz />
      <Quit />
      <Footer />
    </main>
  )
}
