"use client"

import { useState } from "react"
import { useLanguage } from "@/components/providers/language-provider"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { AlertTriangle } from "lucide-react"

export default function Impacts() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("respiratory")

  const impacts = [
    {
      id: "respiratory",
      title: "impacts.respiratory",
      desc: "impacts.respiratory.desc",
      image: "/images/respiratory-system.jpg",
      risk: "15-30x",
    },
    {
      id: "cardio",
      title: "impacts.cardio",
      desc: "impacts.cardio.desc",
      image: "/images/heart-system.jpg",
      risk: "2-4x",
    },
    {
      id: "digestive",
      title: "impacts.digestive",
      desc: "impacts.digestive.desc",
      image: "/images/digestive-system.jpeg",
      risk: "20-30%",
    },
    {
      id: "immune",
      title: "impacts.immune",
      desc: "impacts.immune.desc",
      image: "/images/immune-system.png",
      risk: "High",
    },
    {
      id: "mental",
      title: "impacts.mental",
      desc: "impacts.mental.desc",
      image: "/images/stress-mental4.jpg",
      risk: "High",
    },
    {
      id: "passive",
      title: "impacts.passive",
      desc: "impacts.passive.desc",
      image: "/images/passive-smoking.jpg",
      risk: "20-30%",
      critical: true,
    },
  ]

  return (
    <section id="impacts" className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-red-600 font-semibold uppercase tracking-wider text-sm">{t("nav.impacts")}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-4">
            {t("impacts.title")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">{t("impacts.subtitle")}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Tabs */}
          <div className="lg:w-1/3 flex flex-col gap-2">
            {impacts.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "text-left px-6 py-4 rounded-xl transition-all duration-300 font-medium text-lg flex items-center justify-between group",
                  activeTab === item.id
                    ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 shadow-md border-l-4 border-red-500 scale-[1.02]"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-[1.01]",
                  item.critical && "border border-red-300 dark:border-red-900",
                )}
              >
                <span className="flex items-center gap-2">
                  {item.critical && <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />}
                  {t(item.title)}
                </span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:w-2/3 min-h-[500px]">
            <AnimatePresence mode="wait">
              {impacts.map(
                (item) =>
                  activeTab === item.id && (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "bg-slate-50 dark:bg-slate-800/50 rounded-2xl overflow-hidden shadow-xl border",
                        item.critical
                          ? "border-red-300 dark:border-red-900 ring-2 ring-red-500/20"
                          : "border-slate-100 dark:border-slate-700",
                      )}
                    >
                      <div className="relative h-64 md:h-80 w-full overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={t(item.title)}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex items-end p-8">
                          <div className="flex items-center justify-between w-full">
                            <h3 className="text-2xl font-bold text-white">{t(item.title)}</h3>
                            <span className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-bold">
                              {t("impacts.risk.label")}: {item.risk}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-8">
                        <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">{t(item.desc)}</p>
                        <div className="mt-6 flex gap-2">
                          <span
                            className={cn(
                              "inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
                              item.critical
                                ? "bg-red-600 text-white animate-pulse"
                                : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
                            )}
                          >
                            {item.critical ? "⚠️ CRITICAL IMPACT" : "High Risk"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ),
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
