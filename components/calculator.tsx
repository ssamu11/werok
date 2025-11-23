"use client"

import { useState } from "react"
import { useLanguage } from "@/components/providers/language-provider"
import { DollarSign, AlertTriangle } from "lucide-react"

export default function Calculator() {
  const { t } = useLanguage()
  const [packsPerDay, setPacksPerDay] = useState(1)
  const [pricePerPack, setPricePerPack] = useState(35000)
  const [years, setYears] = useState(5)

  const totalCost = packsPerDay * pricePerPack * 365 * years
  const totalCigs = packsPerDay * 20 * 365 * years
  // Approx 11 minutes life lost per cigarette
  const timeLostMinutes = totalCigs * 11
  const timeLostDays = Math.floor(timeLostMinutes / (60 * 24))

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getAlternative = (amount: number) => {
    if (amount > 500000000) return t("calc.item.house")
    if (amount > 200000000) return t("calc.item.car")
    if (amount > 30000000) return t("calc.item.umrah")
    return t("calc.item.laptop")
  }

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-red-600 font-semibold uppercase tracking-wider text-sm">Calculator</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-6">
              {t("calc.title")}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">{t("calc.subtitle")}</p>

            <div className="space-y-6 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t("calc.label.packs")}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={packsPerDay}
                  onChange={(e) => setPacksPerDay(Number.parseFloat(e.target.value))}
                  className="w-full accent-red-600"
                />
                <span className="block mt-2 font-bold text-red-600">{packsPerDay} Bungkus</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t("calc.label.price")}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">Rp</span>
                  <input
                    type="number"
                    value={pricePerPack}
                    onChange={(e) => setPricePerPack(Number.parseInt(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t("calc.label.years")}
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={years}
                  onChange={(e) => setYears(Number.parseInt(e.target.value))}
                  className="w-full accent-red-600"
                />
                <span className="block mt-2 font-bold text-red-600">{years} Tahun</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-red-600 to-red-800 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <DollarSign className="w-32 h-32" />
              </div>
              <p className="text-red-100 font-medium mb-2">{t("calc.result.money")}</p>
              <h3 className="text-4xl md:text-5xl font-bold mb-4">{formatCurrency(totalCost)}</h3>
              <p className="text-sm text-red-100/80 mb-6">{t("calc.desc")}</p>
              <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg font-semibold">
                🛍️ {getAlternative(totalCost)}
              </div>
            </div>

            <div className="bg-slate-900 dark:bg-black p-8 rounded-3xl text-white shadow-xl relative overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <AlertTriangle className="w-32 h-32" />
              </div>
              <p className="text-slate-400 font-medium mb-2">{t("calc.result.time")}</p>
              <h3 className="text-4xl md:text-5xl font-bold mb-2 text-red-500">{timeLostDays} Hari</h3>
              <p className="text-sm text-slate-500">
                Estimasi waktu hidup yang hilang berdasarkan statistik medis (11 menit/batang).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
