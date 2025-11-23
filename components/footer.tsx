"use client"

import { useLanguage } from "@/components/providers/language-provider"
import { Phone, Info } from "lucide-react"

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-slate-950 text-white pt-20 pb-10 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1 space-y-6">
            <div>
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent inline-block tracking-tight">
                WEROK
              </h2>
              <p className="text-slate-400 text-sm mt-4 leading-relaxed">{t("footer.tagline")}</p>
            </div>

            {/* Warning Image */}
            <div className="border border-red-900/50 rounded-lg overflow-hidden max-w-[200px] shadow-lg shadow-red-900/20">
              <img
                src="/images/peringatan-membunuhmu.jpg"
                alt="Peringatan Merokok"
                className="w-full opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6 border-b border-slate-800 pb-2 inline-block">
              Menu
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#causes"
                  className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-red-500 rounded-full opacity-0 hover:opacity-100"></span>
                  {t("nav.causes")}
                </a>
              </li>
              <li>
                <a
                  href="#impacts"
                  className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-red-500 rounded-full opacity-0 hover:opacity-100"></span>
                  {t("nav.impacts")}
                </a>
              </li>
              <li>
                <a
                  href="#myths"
                  className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-red-500 rounded-full opacity-0 hover:opacity-100"></span>
                  {t("nav.myths")}
                </a>
              </li>
              <li>
                <a href="#quiz" className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-500 rounded-full opacity-0 hover:opacity-100"></span>
                  {t("nav.quiz")}
                </a>
              </li>
              <li>
                <a href="#quit" className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-500 rounded-full opacity-0 hover:opacity-100"></span>
                  {t("nav.quit")}
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6 border-b border-slate-800 pb-2 inline-block">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Download PDF Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Community Forum
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Find a Clinic
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6 border-b border-slate-800 pb-2 inline-block">
              Contact & Support
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Emergency Hotline</p>
                  <p className="text-white font-mono text-lg tracking-wide">0-800-177-6565</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <Info className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Data Sources</p>
                  <p className="text-slate-300 text-sm">
                    World Health Organization (WHO)
                    <br />
                    Kementerian Kesehatan RI
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
          <p>{t("footer.copyright")}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
