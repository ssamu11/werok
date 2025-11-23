"use client"

import { useLanguage } from "@/components/providers/language-provider"
import { motion } from "framer-motion"
import { Dna, Brain, BookOpen, EyeOff, Link2, Users, Radio, Wallet, MapPin, Scale } from "lucide-react"

export default function Causes() {
  const { t } = useLanguage()

  const internalFactors = [
    { icon: <Dna className="w-6 h-6" />, title: "causes.genetic", desc: "causes.genetic.desc" },
    { icon: <Brain className="w-6 h-6" />, title: "causes.psych", desc: "causes.psych.desc" },
    { icon: <BookOpen className="w-6 h-6" />, title: "causes.knowledge", desc: "causes.knowledge.desc" },
    { icon: <EyeOff className="w-6 h-6" />, title: "causes.perception", desc: "causes.perception.desc" },
    { icon: <Link2 className="w-6 h-6" />, title: "causes.dependence", desc: "causes.dependence.desc" },
  ]

  const externalFactors = [
    { icon: <Users className="w-6 h-6" />, title: "causes.family", desc: "causes.family.desc" },
    { icon: <Users className="w-6 h-6" />, title: "causes.peers", desc: "causes.peers.desc" },
    { icon: <Radio className="w-6 h-6" />, title: "causes.media", desc: "causes.media.desc" },
    { icon: <Wallet className="w-6 h-6" />, title: "causes.socio", desc: "causes.socio.desc" },
    { icon: <MapPin className="w-6 h-6" />, title: "causes.access", desc: "causes.access.desc" },
    { icon: <Scale className="w-6 h-6" />, title: "causes.policy", desc: "causes.policy.desc" },
  ]

  const Card = ({ icon, title, desc }: { icon: any; title: string; desc: string }) => (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 transition-all hover:shadow-xl hover:border-red-200 dark:hover:border-red-900/50 cursor-pointer h-full"
    >
      <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t(title)}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{t(desc)}</p>
    </motion.div>
  )

  return (
    <section id="causes" className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-red-600 font-semibold uppercase tracking-wider text-sm">{t("nav.causes")}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-4">
            {t("causes.title")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">{t("causes.subtitle")}</p>
        </div>

        <div className="space-y-16">
          {/* Internal Factors */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 border-l-4 border-red-500 pl-4">
              {t("causes.internal")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {internalFactors.map((factor, idx) => (
                <Card key={idx} {...factor} />
              ))}
            </div>
          </div>

          {/* External Factors */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 border-l-4 border-yellow-500 pl-4">
              {t("causes.external")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {externalFactors.map((factor, idx) => (
                <Card key={idx} {...factor} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
