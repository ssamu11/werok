"use client"

import { useLanguage } from "@/components/providers/language-provider"
import { Quote } from "lucide-react"

export default function Testimonials() {
  const { t } = useLanguage()

  const testimonials = [1, 2, 3]

  return (
    <section className="py-24 bg-slate-100 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-red-600 font-semibold uppercase tracking-wider text-sm">{t("nav.testimonials")}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-4">
            {t("testimonials.title")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">{t("testimonials.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((id) => (
            <div
              key={id}
              className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-red-100 dark:text-red-900/30 fill-current" />

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xl font-bold text-slate-500 dark:text-slate-400">
                  {t(`testimonial.${id}.name`).charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{t(`testimonial.${id}.name`)}</h4>
                  <p className="text-xs text-slate-500 uppercase">{t(`testimonial.${id}.location`)}</p>
                </div>
              </div>

              <div className="mb-4">
                <span className="inline-block px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded">
                  {t(`testimonial.${id}.years`)}
                </span>
              </div>

              <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed">
                "{t(`testimonial.${id}.quote`)}"
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium bg-slate-200 dark:bg-slate-800 inline-block px-4 py-2 rounded-full">
            {t("testimonial.source")}
          </p>
        </div>
      </div>
    </section>
  )
}
