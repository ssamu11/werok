"use client"

import { useLanguage } from "@/components/providers/language-provider"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Skull, FlaskConical, Activity } from "lucide-react"

export default function Hero() {
  const { t } = useLanguage()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img src="/images/hero-smoking.jpg" alt="Smoke Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-transparent dark:from-slate-950/95 dark:via-slate-900/90 dark:to-slate-900/60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
            <motion.div variants={itemVariants}>
              <span className="inline-block py-1 px-3 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-sm font-semibold mb-4">
                #StopMerokok
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight text-balance">
                {t("hero.title")}
              </h1>
              <p className="mt-4 text-xl text-slate-300 max-w-lg leading-relaxed">{t("hero.subtitle")}</p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white border-none rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-red-500/30 transition-all duration-300"
                onClick={() => scrollToSection("causes")}
              >
                {t("hero.cta")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-700/50">
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-red-500 mb-1">
                  <Skull className="h-5 w-5" />
                  <span className="font-bold text-2xl">225k+</span>
                </div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">{t("hero.stat.deaths")}</p>
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-yellow-500 mb-1">
                  <FlaskConical className="h-5 w-5" />
                  <span className="font-bold text-2xl">7000+</span>
                </div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">{t("hero.stat.chemicals")}</p>
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-orange-500 mb-1">
                  <Activity className="h-5 w-5" />
                  <span className="font-bold text-2xl">2-4x</span>
                </div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">{t("hero.stat.stroke")}</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4">
              <p className="text-xs text-slate-500 italic">{t("hero.source")}</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden lg:block relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="relative z-10 bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl shadow-2xl">
                <div className="space-y-6">
                  {/* Clickable card to Impacts section */}
                  <button
                    onClick={() => scrollToSection("impacts")}
                    className="w-full flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 hover:border-red-500/50 hover:bg-slate-900/70 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                      <Activity />
                    </div>
                    <div className="text-left">
                      <h4 className="text-white font-semibold group-hover:text-red-400 transition-colors">
                        {t("hero.card.impacts")}
                      </h4>
                      <p className="text-slate-400 text-sm">{t("hero.card.impacts.desc")}</p>
                    </div>
                    <ArrowRight className="ml-auto h-5 w-5 text-slate-600 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                  </button>

                  {/* Static card for Toxic Compounds */}
                  <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                      <FlaskConical />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{t("hero.card.toxic")}</h4>
                      <p className="text-slate-400 text-sm">{t("hero.card.toxic.desc")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
