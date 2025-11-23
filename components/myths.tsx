"use client"

import { useLanguage } from "@/components/providers/language-provider"
import { Check, X } from "lucide-react"

export default function Myths() {
  const { t } = useLanguage()

  const mythData = [1, 2, 3, 4, 5]

  return (
    <section id="myths" className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-red-600 font-semibold uppercase tracking-wider text-sm">{t("nav.myths")}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-4">
            {t("myths.title")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">{t("myths.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mythData.map((num) => (
            <div
              key={num}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row h-full hover:shadow-xl transition-shadow"
            >
              {/* Myth Side */}
              <div className="flex-1 p-8 bg-red-50/50 dark:bg-red-950/10 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 flex items-center justify-center shadow-sm">
                    <X className="h-6 w-6 stroke-[3]" />
                  </div>
                  <span className="font-bold text-red-600 dark:text-red-500 uppercase tracking-wide text-sm">
                    Mitos
                  </span>
                </div>
                <p className="text-lg font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  {t(`myth.${num}`)}
                </p>
              </div>

              {/* Fact Side */}
              <div className="flex-1 p-8 bg-green-50/50 dark:bg-green-950/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 flex items-center justify-center shadow-sm">
                    <Check className="h-6 w-6 stroke-[3]" />
                  </div>
                  <span className="font-bold text-green-600 dark:text-green-500 uppercase tracking-wide text-sm">
                    Fakta
                  </span>
                </div>
                <p className="text-lg font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  {t(`fact.${num}`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
