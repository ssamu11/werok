"use client"

import { useLanguage } from "@/components/providers/language-provider"
import { Calendar, Search, Users, Pill, Activity, Heart, Clock, Share2 } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function Quit() {
  const { t } = useLanguage()

  const steps = [
    { icon: <Calendar className="w-6 h-6" />, title: "quit.step1", desc: "quit.step1.desc", tip: "quit.step1.tip" },
    { icon: <Search className="w-6 h-6" />, title: "quit.step2", desc: "quit.step2.desc", tip: "quit.step2.tip" },
    { icon: <Users className="w-6 h-6" />, title: "quit.step3", desc: "quit.step3.desc", tip: "quit.step3.tip" },
    { icon: <Pill className="w-6 h-6" />, title: "quit.step4", desc: "quit.step4.desc", tip: "quit.step4.tip" },
    { icon: <Activity className="w-6 h-6" />, title: "quit.step5", desc: "quit.step5.desc", tip: "quit.step5.tip" },
    { icon: <Heart className="w-6 h-6" />, title: "quit.step6", desc: "quit.step6.desc", tip: "quit.step6.tip" },
  ]

  const benefits = [
    { time: "quit.timeline.20min", desc: "quit.timeline.20min.desc" },
    { time: "quit.timeline.12hr", desc: "quit.timeline.12hr.desc" },
    { time: "quit.timeline.2wk", desc: "quit.timeline.2wk.desc" },
    { time: "quit.timeline.1yr", desc: "quit.timeline.1yr.desc" },
    { time: "quit.timeline.5yr", desc: "quit.timeline.5yr.desc" },
    { time: "quit.timeline.10yr", desc: "quit.timeline.10yr.desc" },
  ]

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "WEROK - Berhenti Merokok Sekarang",
          text: "Pelajari cara berhenti merokok dan hidup lebih sehat bersama WEROK.",
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing", err)
      }
    }
  }

  return (
    <section id="quit" className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-red-600 font-semibold uppercase tracking-wider text-sm">{t("nav.quit")}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-4">{t("quit.title")}</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">{t("quit.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all hover:-translate-y-1 group"
            >
              {/* Number Badge */}
              <div className="absolute top-0 right-0 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 text-4xl font-black p-4 rounded-bl-3xl opacity-50 group-hover:text-red-500/20 transition-colors">
                {idx + 1}
              </div>

              <div className="w-14 h-14 bg-red-500 text-white rounded-xl flex items-center justify-center mb-6 shadow-md shadow-red-500/30">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t(step.title)}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{t(step.desc)}</p>

              <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium italic">{t(step.tip)}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Timeline */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-800 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              {t("quit.benefits.title")}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">{t("quit.benefits.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="flex gap-4 items-start p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{t(benefit.time)}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t(benefit.desc)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share Card */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold">{t("quit.share.title")}</h3>
            <p className="text-red-100 text-lg">{t("quit.share.desc")}</p>
            <Button
              onClick={handleShare}
              size="lg"
              variant="secondary"
              className="bg-white text-red-600 hover:bg-slate-100 font-bold rounded-full px-8 shadow-lg"
            >
              <Share2 className="w-5 h-5 mr-2" />
              {t("quit.share.button")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
