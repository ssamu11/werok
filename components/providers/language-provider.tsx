"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type Language = "id" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const translations = {
  id: {
    // Nav
    "nav.home": "Beranda",
    "nav.causes": "Penyebab",
    "nav.impacts": "Dampak",
    "nav.myths": "Mitos vs Fakta",
    "nav.quiz": "Kuis",
    "nav.quit": "Cara Berhenti",
    "nav.testimonials": "Kisah Nyata",

    // Hero
    "hero.title": "Rokok Merusak Tubuhmu — Tapi Kamu Bisa Mulai Menyelamatkannya Hari Ini",
    "hero.subtitle":
      "Merokok bukan hanya membunuhmu, tapi juga impian dan orang-orang di sekitarmu. Mari selamatkan keluargamu.",
    "hero.cta": "Mulai Belajar Sekarang",
    "hero.stat.deaths": "Kematian/Tahun di Indonesia",
    "hero.stat.chemicals": "Bahan Kimia Beracun",
    "hero.stat.stroke": "Risiko Stroke Lebih Tinggi",
    "hero.source": "Sumber data: WHO dan Kementerian Kesehatan RI",
    "hero.card.impacts": "Dampak Sistemik",
    "hero.card.impacts.desc": "Kerusakan organ vital",
    "hero.card.toxic": "Zat Beracun",
    "hero.card.toxic.desc": "Tar, Nikotin, CO, Arsenik",

    // Causes
    "causes.title": "Mengapa Orang Merokok?",
    "causes.subtitle": "Memahami akar masalah adalah langkah pertama menuju perubahan.",
    "causes.internal": "Faktor Internal (Dalam Diri)",
    "causes.external": "Faktor Eksternal (Lingkungan)",
    "causes.genetic": "Genetik & Biologis",
    "causes.genetic.desc":
      "Penelitian menunjukkan bahwa 40-60% risiko kecanduan nikotin dipengaruhi oleh faktor keturunan. Reseptor nikotin di otak bervariasi antar individu, mempengaruhi tingkat kecanduan.",
    "causes.psych": "Psikologis & Emosi",
    "causes.psych.desc":
      "Stres, kecemasan, dan depresi sering menjadi pemicu utama. Merokok dipandang sebagai pelarian sementara, namun justru memperburuk kondisi mental jangka panjang.",
    "causes.knowledge": "Kurang Pengetahuan",
    "causes.knowledge.desc":
      "Banyak perokok, terutama remaja, tidak memahami dampak jangka panjang. Mereka menganggap bahaya rokok hanya cerita untuk menakuti, padahal data medis sangat jelas.",
    "causes.perception": "Persepsi Manfaat Palsu",
    "causes.perception.desc":
      "Keyakinan bahwa rokok meningkatkan konsentrasi atau menghilangkan stres adalah mitos. Yang terjadi adalah tubuh hanya menghilangkan gejala putus nikotin.",
    "causes.dependence": "Ketergantungan Nikotin",
    "causes.dependence.desc":
      "Nikotin mencapai otak dalam 10 detik setelah dihisap, menciptakan kecanduan yang sangat kuat. Tubuh membutuhkan dosis berulang untuk merasa 'normal'.",
    "causes.family": "Pengaruh Keluarga",
    "causes.family.desc":
      "Anak yang tumbuh di keluarga perokok memiliki risiko 2-3x lebih tinggi untuk merokok. Perilaku orang tua dinormalisasi sebagai hal yang wajar.",
    "causes.peers": "Tekanan Teman Sebaya",
    "causes.peers.desc":
      "Di kalangan remaja, merokok sering dianggap sebagai simbol 'gaul' atau 'dewasa'. Tekanan untuk diterima kelompok sangat kuat pada usia ini.",
    "causes.media": "Media & Iklan",
    "causes.media.desc":
      "Pencitraan rokok sebagai simbol kejantanan, kebebasan, atau gaya hidup mewah sangat efektif. Industri menghabiskan miliaran untuk iklan yang menjangkau anak muda.",
    "causes.socio": "Kondisi Sosial Ekonomi",
    "causes.socio.desc":
      "Lingkungan dengan tingkat stres tinggi dan keterbatasan ekonomi memiliki prevalensi merokok lebih tinggi. Rokok dipandang sebagai pelarian murah.",
    "causes.access": "Mudah Diakses",
    "causes.access.desc":
      "Rokok dijual bebas di warung, minimarket, bahkan pedagang keliling. Harga terjangkau dan tidak ada verifikasi usia membuat siapa saja bisa membeli.",
    "causes.policy": "Kebijakan Longgar",
    "causes.policy.desc":
      "Kurangnya penegakan aturan kawasan tanpa rokok dan sanksi lemah membuat perokok bebas merokok di mana saja, termasuk area publik.",

    // Impacts
    "impacts.title": "Dampak Bagi Tubuh",
    "impacts.subtitle": "Kerusakan sistemik terjadi setiap kali kamu menghisap rokok. Tidak ada batas aman.",
    "impacts.respiratory": "Sistem Pernapasan",
    "impacts.respiratory.desc":
      "Merokok merusak silia (rambut halus) di paru-paru, menyebabkan penumpukan lendir dan infeksi kronis. Risiko kanker paru meningkat 15-30x pada perokok aktif. PPOK (Penyakit Paru Obstruktif Kronis) menyebabkan sesak napas permanen.",
    "impacts.cardio": "Sistem Kardiovaskular",
    "impacts.cardio.desc":
      "Merokok meningkatkan detak jantung dan tekanan darah secara langsung. Risiko serangan jantung naik 2-4x, stroke 2-4x, dan hipertensi 20-30%. Pembuluh darah menyempit dan rusak permanen.",
    "impacts.digestive": "Sistem Pencernaan",
    "impacts.digestive.desc":
      "Rokok melemahkan katup lambung, menyebabkan refluks asam (GERD) yang kronis. Risiko kanker lambung, pankreas, dan esofagus meningkat signifikan. Penyerapan nutrisi juga terganggu.",
    "impacts.immune": "Sistem Kekebalan Tubuh",
    "impacts.immune.desc":
      "Zat kimia rokok melemahkan sel darah putih dan antibodi, membuat tubuh rentan infeksi. Perokok lebih mudah sakit, penyembuhan luka lebih lama, dan lebih berisiko terkena penyakit autoimun.",
    "impacts.mental": "Kesehatan Mental",
    "impacts.mental.desc":
      "Meskipun merokok tampak menenangkan, nikotin sebenarnya meningkatkan kecemasan dan depresi jangka panjang. Siklus kecanduan menciptakan stres emosional yang berkelanjutan.",
    "impacts.passive": "⚠️ Perokok Pasif (DAMPAK Kritis)",
    "impacts.passive.desc":
      "Asap rokok orang lain (secondhand smoke) mengandung lebih dari 7,000 bahan kimia. Anak-anak, ibu hamil, dan orang tua sangat rentan. Risiko kanker paru pada pasangan perokok naik 20-30%, bayi berisiko kematian mendadak (SIDS), dan anak-anak lebih sering asma.",
    "impacts.risk.label": "Peningkatan Risiko",

    // Myths
    "myths.title": "Mitos vs Fakta Rokok",
    "myths.subtitle": "Jika kamu pernah percaya salah satunya, kamu tidak sendirian. Mari luruskan bersama.",
    "myth.1": "Rokok ringan (mild/light) lebih aman untuk kesehatan.",
    "fact.1":
      "TIDAK ADA batas aman rokok. Rokok 'mild' hanya trik pemasaran. Perokok justru menghisap lebih dalam dan lebih sering untuk mendapat efek yang sama, sehingga tar dan nikotin yang masuk tetap tinggi.",
    "myth.2": "Merokok bisa membuat badan kurus dan langsing.",
    "fact.2":
      "Merokok memang menekan nafsu makan, tapi dengan cara yang sangat tidak sehat. Metabolisme rusak, nutrisi tidak terserap, dan tubuh kehilangan massa otot. Berat turun bukan karena sehat, tapi karena tubuh sakit.",
    "myth.3": "Sudah terlambat untuk berhenti, tubuh sudah terlanjur rusak.",
    "fact.3":
      "TIDAK PERNAH TERLAMBAT. Tubuh memiliki kemampuan luar biasa untuk pulih. 20 menit setelah berhenti, detak jantung normal. 12 jam, karbon monoksida keluar. 2-12 minggu, sirkulasi darah membaik drastis.",
    "myth.4": "Vape / rokok elektrik lebih aman daripada rokok biasa.",
    "fact.4":
      "Vape BUKAN alternatif aman. Tetap mengandung nikotin (sangat adiktif), propilen glikol, dan bahan kimia berbahaya lain. Beberapa kasus kerusakan paru akut (EVALI) telah dilaporkan pada pengguna vape.",
    "myth.5": "Merokok hanya sesekali atau sosial tidak berbahaya.",
    "fact.5":
      "Tidak ada level aman merokok. Bahkan 1 batang per hari meningkatkan risiko penyakit jantung hingga 50%. Nikotin juga sangat adiktif — 'coba-coba' bisa berakhir menjadi kebiasaan tetap.",

    // Quit
    "quit.title": "Cara Berhenti Merokok — Kamu Bisa!",
    "quit.subtitle": "6 Langkah pasti menuju hidup bebas asap rokok. Ribuan orang berhasil, kamu juga bisa.",
    "quit.step1": "1. Tentukan Tanggal Berhenti",
    "quit.step1.desc":
      "Pilih tanggal spesial (ulang tahun, tahun baru, atau hari penting) dan tandai di kalender. Beritahu orang terdekat untuk dukungan.",
    "quit.step1.tip": "💡 Tip: Pilih tanggal dalam 2 minggu ke depan. Jangan terlalu lama menunda!",
    "quit.step2": "2. Kenali Pemicu Rokok",
    "quit.step2.desc":
      "Catat situasi yang membuatmu ingin merokok: setelah makan, saat stres, atau saat berkumpul dengan teman tertentu.",
    "quit.step2.tip":
      "💡 Tip: Buat daftar alternatif untuk setiap pemicu (misal: permen karet, jalan kaki, minum air).",
    "quit.step3": "3. Cari Dukungan Sosial",
    "quit.step3.desc":
      "Beritahu keluarga, teman, dan rekan kerja bahwa kamu sedang berhenti. Minta mereka tidak merokok di dekatmu.",
    "quit.step3.tip": "💡 Tip: Gabung dengan komunitas atau grup online untuk berbagi pengalaman dan motivasi.",
    "quit.step4": "4. Terapi Pengganti Nikotin",
    "quit.step4.desc":
      "Gunakan permen karet nikotin, patch, atau lozenges untuk mengurangi gejala putus nikotin. Konsultasi dokter untuk dosis yang tepat.",
    "quit.step4.tip": "💡 Tip: NRT (Nicotine Replacement Therapy) meningkatkan peluang sukses hingga 50-70%.",
    "quit.step5": "5. Kelola Gejala Putus Zat",
    "quit.step5.desc":
      "Siapkan camilan sehat (wortel, kacang), air putih, dan aktivitas pengganti (olahraga ringan, hobi). Gejala akan berkurang dalam 2-4 minggu.",
    "quit.step5.tip": "💡 Tip: Pernapasan dalam dan meditasi sangat efektif mengurangi stres dan keinginan merokok.",
    "quit.step6": "6. Tetap Motivasi & Pantau Progres",
    "quit.step6.desc":
      "Ingat alasanmu: kesehatan, keluarga, finansial. Hitung uang yang kamu hemat setiap hari. Rayakan milestone kecil!",
    "quit.step6.tip": "💡 Tip: Buat daftar manfaat yang sudah kamu rasakan (napas lega, stamina naik, kulit cerah).",

    "quit.benefits.title": "Manfaat Berhenti Merokok",
    "quit.benefits.subtitle": "Tubuhmu mulai pulih dari menit pertama. Ini timeline yang akan kamu alami:",
    "quit.timeline.20min": "20 Menit",
    "quit.timeline.20min.desc": "Detak jantung dan tekanan darah kembali normal.",
    "quit.timeline.12hr": "12 Jam",
    "quit.timeline.12hr.desc": "Kadar karbon monoksida dalam darah turun ke level normal.",
    "quit.timeline.2wk": "2-12 Minggu",
    "quit.timeline.2wk.desc": "Sirkulasi darah membaik, fungsi paru meningkat signifikan.",
    "quit.timeline.1yr": "1 Tahun",
    "quit.timeline.1yr.desc": "Risiko penyakit jantung koroner turun hingga 50%.",
    "quit.timeline.5yr": "5 Tahun",
    "quit.timeline.5yr.desc": "Risiko stroke turun setara dengan non-perokok.",
    "quit.timeline.10yr": "10 Tahun",
    "quit.timeline.10yr.desc": "Risiko kanker paru turun hingga 50% dibanding perokok aktif.",

    "quit.share.title": "Bagikan Halaman Ini",
    "quit.share.desc":
      "Kamu bisa membantu orang lain berhenti merokok dengan membagikan informasi ini. Satu share bisa menyelamatkan nyawa!",
    "quit.share.button": "Bagikan ke Teman & Keluarga",

    // Quiz
    "quiz.title": "Kuis Pengetahuan Rokok",
    "quiz.question": "Pertanyaan",
    "quiz.score": "Skor",
    "quiz.start": "Mulai Kuis",
    "quiz.result.title": "Hasil Kuis Kamu",
    "quiz.result.perfect": "Luar Biasa! Kamu sangat paham bahaya rokok.",
    "quiz.result.good": "Bagus! Kamu mengerti sebagian besar risiko.",
    "quiz.result.poor": "Perlu belajar lagi. Bahaya rokok lebih serius dari yang kamu kira.",
    "quiz.retry": "Coba Lagi",

    "quiz.q1": "Berapa banyak bahan kimia berbahaya dalam satu batang rokok?",
    "quiz.q1.a": "100-200",
    "quiz.q1.b": "500-1,000",
    "quiz.q1.c": "4,000-7,000",
    "quiz.q1.d": "Lebih dari 7,000",
    "quiz.q1.expl":
      "Asap rokok mengandung lebih dari 7,000 bahan kimia, di mana 250 di antaranya berbahaya dan 69 menyebabkan kanker.",

    "quiz.q2": "Organ tubuh mana yang paling pertama rusak akibat rokok?",
    "quiz.q2.a": "Jantung",
    "quiz.q2.b": "Paru-paru",
    "quiz.q2.c": "Lambung",
    "quiz.q2.d": "Semua benar",
    "quiz.q2.expl":
      "Asap rokok langsung masuk ke paru-paru, namun racunnya menyebar lewat darah dan merusak hampir semua organ tubuh secara bersamaan.",

    "quiz.q3": "Apa efek nikotin pada otak remaja?",
    "quiz.q3.a": "Meningkatkan IQ",
    "quiz.q3.b": "Mengganggu perkembangan otak",
    "quiz.q3.c": "Membuat lebih dewasa",
    "quiz.q3.d": "Tidak ada efek",
    "quiz.q3.expl":
      "Otak remaja masih berkembang hingga usia 25. Nikotin mengganggu pembentukan sinapsis yang mengontrol perhatian dan pembelajaran.",

    "quiz.q4": "Berapa lama waktu yang dibutuhkan nikotin untuk mencapai otak?",
    "quiz.q4.a": "1 menit",
    "quiz.q4.b": "10 detik",
    "quiz.q4.c": "5 menit",
    "quiz.q4.d": "1 jam",
    "quiz.q4.expl":
      "Sangat cepat! Dalam 10 detik hisapan, nikotin mencapai otak dan memicu pelepasan dopamin, inilah yang membuat kecanduan sangat cepat terjadi.",

    "quiz.q5": "Penyakit apa yang paling sering diderita perokok pasif anak-anak?",
    "quiz.q5.a": "Asma & Infeksi Telinga",
    "quiz.q5.b": "Diabetes",
    "quiz.q5.c": "Rematik",
    "quiz.q5.d": "Sakit Gigi",
    "quiz.q5.expl":
      "Anak-anak yang terpapar asap rokok memiliki risiko tinggi terkena asma akut, infeksi telinga, dan gangguan pernapasan lainnya.",

    // Testimonials
    "testimonials.title": "Mereka Berhasil, Kamu Juga Bisa!",
    "testimonials.subtitle": "Kisah nyata dari orang-orang yang berhasil lepas dari jeratan rokok.",
    "testimonial.source": "Sumber: Yayasan Jantung Indonesia & Komunitas Berhenti Merokok",
    "testimonial.1.name": "Budi Santoso, 38 tahun",
    "testimonial.1.location": "Jakarta",
    "testimonial.1.years": "Perokok selama 15 tahun",
    "testimonial.1.quote":
      "Dulu saya merokok 2 bungkus sehari. Setelah anak pertama lahir, saya sadar saya ingin melihat dia besar. Sekarang sudah 3 tahun bebas rokok, napas lega, dan uang hemat jutaan rupiah!",
    "testimonial.2.name": "Siti Aminah, 45 tahun",
    "testimonial.2.location": "Surabaya",
    "testimonial.2.years": "Perokok selama 20 tahun",
    "testimonial.2.quote":
      "Saya pikir saya tidak bisa berhenti. Tapi setelah diagnosa PPOK, saya harus memilih: rokok atau nyawa. Dengan dukungan keluarga dan terapi NRT, saya berhasil! Sekarang saya bisa jalan tanpa sesak napas.",
    "testimonial.3.name": "Andi Wijaya, 29 tahun",
    "testimonial.3.location": "Bandung",
    "testimonial.3.years": "Perokok selama 10 tahun",
    "testimonial.3.quote":
      "Sebagai freelancer, saya stres dan rokok jadi pelarian. Setelah ikut program berhenti merokok, saya ganti dengan olahraga. Produktivitas naik, kesehatan membaik, dan yang paling penting: saya bebas dari kecanduan!",

    // Footer
    "footer.hotline": "Hotline Berhenti Merokok: 0-800-177-6565",
    "footer.source": "Sumber: WHO & Kemenkes RI",
    "footer.copyright": "© 2025 WEROK. Platform Edukasi Anti-Rokok Indonesia.",
    "footer.tagline": "Platform edukasi interaktif untuk hidup sehat tanpa rokok.",

    // Calculator
    "calc.title": "Kalkulator Hemat",
    "calc.subtitle": "Lihat berapa banyak uang (dan nyawa) yang kamu bakar.",
    "calc.label.packs": "Bungkus per hari",
    "calc.label.price": "Harga per bungkus (Rp)",
    "calc.label.years": "Tahun merokok",
    "calc.result.money": "Uang Terbakar",
    "calc.result.time": "Waktu Terbuang",
    "calc.desc": "Jika kamu berinvestasi uang ini, kamu bisa membeli:",
    "calc.item.house": "DP Rumah",
    "calc.item.car": "Mobil Baru",
    "calc.item.umrah": "Paket Umrah",
    "calc.item.laptop": "Laptop Gaming",
  },
  en: {
    // Nav
    "nav.home": "Home",
    "nav.causes": "Causes",
    "nav.impacts": "Impacts",
    "nav.myths": "Myths vs Facts",
    "nav.quiz": "Quiz",
    "nav.quit": "How to Quit",
    "nav.testimonials": "Success Stories",

    // Hero
    "hero.title": "Smoking Destroys Your Body — But You Can Start Saving It Today",
    "hero.subtitle":
      "Smoking doesn't just kill you, it kills your dreams and those around you. Let's save your family.",
    "hero.cta": "Start Learning Now",
    "hero.stat.deaths": "Deaths/Year in Indonesia",
    "hero.stat.chemicals": "Toxic Chemicals",
    "hero.stat.stroke": "Higher Stroke Risk",
    "hero.source": "Data source: WHO and Ministry of Health RI",
    "hero.card.impacts": "Systemic Impact",
    "hero.card.impacts.desc": "Vital organ damage",
    "hero.card.toxic": "Toxic Substances",
    "hero.card.toxic.desc": "Tar, Nicotine, CO, Arsenic",

    // Causes
    "causes.title": "Why Do People Smoke?",
    "causes.subtitle": "Understanding the root cause is the first step toward change.",
    "causes.internal": "Internal Factors (Within Self)",
    "causes.external": "External Factors (Environment)",
    "causes.genetic": "Genetic & Biological",
    "causes.genetic.desc":
      "Research shows 40-60% of nicotine addiction risk is influenced by heredity. Nicotine receptors in the brain vary between individuals, affecting addiction levels.",
    "causes.psych": "Psychological & Emotional",
    "causes.psych.desc":
      "Stress, anxiety, and depression are major triggers. Smoking is seen as temporary escape, but worsens mental health long-term.",
    "causes.knowledge": "Lack of Knowledge",
    "causes.knowledge.desc":
      "Many smokers, especially teens, don't understand long-term impacts. They view smoking dangers as scare tactics, despite clear medical data.",
    "causes.perception": "False Benefit Perception",
    "causes.perception.desc":
      "Belief that smoking improves focus or relieves stress is myth. What happens is body only relieves nicotine withdrawal symptoms.",
    "causes.dependence": "Nicotine Dependence",
    "causes.dependence.desc":
      "Nicotine reaches brain in 10 seconds after inhalation, creating very strong addiction. Body needs repeated doses to feel 'normal'.",
    "causes.family": "Family Influence",
    "causes.family.desc":
      "Children growing up in smoking families have 2-3x higher risk to smoke. Parental behavior is normalized as acceptable.",
    "causes.peers": "Peer Pressure",
    "causes.peers.desc":
      "Among teens, smoking is often seen as 'cool' or 'mature' symbol. Pressure to be accepted in groups is very strong at this age.",
    "causes.media": "Media & Advertising",
    "causes.media.desc":
      "Portraying smoking as masculinity symbol, freedom, or luxury lifestyle is very effective. Industry spends billions on ads targeting youth.",
    "causes.socio": "Socioeconomic Conditions",
    "causes.socio.desc":
      "Environments with high stress and economic limitations have higher smoking prevalence. Smoking is seen as cheap escape.",
    "causes.access": "Easy Access",
    "causes.access.desc":
      "Cigarettes sold freely in stalls, minimarkets, even street vendors. Affordable prices and no age verification let anyone buy.",
    "causes.policy": "Loose Policies",
    "causes.policy.desc":
      "Lack of smoke-free zone enforcement and weak sanctions allow smokers to smoke anywhere, including public areas.",

    // Impacts
    "impacts.title": "Impact on the Body",
    "impacts.subtitle": "Systemic damage occurs every time you inhale smoke. There's no safe limit.",
    "impacts.respiratory": "Respiratory System",
    "impacts.respiratory.desc":
      "Smoking damages cilia (tiny hairs) in lungs, causing mucus buildup and chronic infections. Lung cancer risk increases 15-30x in active smokers. COPD causes permanent breathlessness.",
    "impacts.cardio": "Cardiovascular System",
    "impacts.cardio.desc":
      "Smoking directly increases heart rate and blood pressure. Heart attack risk rises 2-4x, stroke 2-4x, and hypertension 20-30%. Blood vessels narrow and permanently damaged.",
    "impacts.digestive": "Digestive System",
    "impacts.digestive.desc":
      "Smoking weakens stomach valve, causing chronic acid reflux (GERD). Risk of stomach, pancreatic, and esophageal cancer significantly increases. Nutrient absorption is also impaired.",
    "impacts.immune": "Immune System",
    "impacts.immune.desc":
      "Cigarette chemicals weaken white blood cells and antibodies, making body prone to infections. Smokers get sick easier, wound healing is slower, and higher risk of autoimmune diseases.",
    "impacts.mental": "Mental Health",
    "impacts.mental.desc":
      "Despite appearing calming, nicotine actually increases anxiety and long-term depression. Addiction cycle creates ongoing emotional stress.",
    "impacts.passive": "⚠️ Passive Smoking (CRITICAL IMPACT)",
    "impacts.passive.desc":
      "Secondhand smoke contains over 7,000 chemicals. Children, pregnant women, and elderly are very vulnerable. Lung cancer risk in smoker's spouse rises 20-30%, babies risk sudden death (SIDS), children suffer more asthma.",
    "impacts.risk.label": "Risk Increase",

    // Myths
    "myths.title": "Smoking Myths vs Facts",
    "myths.subtitle": "If you've believed any of these, you're not alone. Let's correct them together.",
    "myth.1": "Mild/light cigarettes are safer for health.",
    "fact.1":
      "There is NO safe limit for smoking. 'Mild' cigarettes are just marketing tricks. Smokers actually inhale deeper and more often to get same effect, so tar and nicotine intake remains high.",
    "myth.2": "Smoking can make you thin and slim.",
    "fact.2":
      "Smoking does suppress appetite, but in very unhealthy way. Metabolism is damaged, nutrients aren't absorbed, body loses muscle mass. Weight loss isn't from health, but from sickness.",
    "myth.3": "It's too late to quit, body is already damaged.",
    "fact.3":
      "It's NEVER TOO LATE. Body has extraordinary ability to heal. 20 minutes after quitting, heart rate normalizes. 12 hours, carbon monoxide clears. 2-12 weeks, blood circulation dramatically improves.",
    "myth.4": "Vape / e-cigarettes are safer than regular cigarettes.",
    "fact.4":
      "Vape is NOT a safe alternative. Still contains nicotine (highly addictive), propylene glycol, and other harmful chemicals. Several cases of acute lung injury (EVALI) reported in vape users.",
    "myth.5": "Occasional or social smoking is harmless.",
    "fact.5":
      "There's no safe level of smoking. Even 1 cigarette per day increases heart disease risk by 50%. Nicotine is highly addictive — 'trying' can end up becoming permanent habit.",

    // Quit
    "quit.title": "How to Quit Smoking — You Can Do It!",
    "quit.subtitle": "6 proven steps to smoke-free life. Thousands succeeded, you can too.",
    "quit.step1": "1. Set Your Quit Date",
    "quit.step1.desc":
      "Choose special date (birthday, new year, important day) and mark calendar. Tell close ones for support.",
    "quit.step1.tip": "💡 Tip: Choose date within 2 weeks. Don't delay too long!",
    "quit.step2": "2. Identify Smoking Triggers",
    "quit.step2.desc":
      "Note situations that make you want to smoke: after meals, when stressed, or hanging with certain friends.",
    "quit.step2.tip": "💡 Tip: Create alternative list for each trigger (e.g., chewing gum, walking, drinking water).",
    "quit.step3": "3. Seek Social Support",
    "quit.step3.desc": "Tell family, friends, and coworkers you're quitting. Ask them not to smoke near you.",
    "quit.step3.tip": "💡 Tip: Join community or online group to share experiences and motivation.",
    "quit.step4": "4. Nicotine Replacement Therapy",
    "quit.step4.desc":
      "Use nicotine gum, patches, or lozenges to reduce withdrawal symptoms. Consult doctor for right dosage.",
    "quit.step4.tip": "💡 Tip: NRT (Nicotine Replacement Therapy) increases success chances by 50-70%.",
    "quit.step5": "5. Manage Withdrawal Symptoms",
    "quit.step5.desc":
      "Prepare healthy snacks (carrots, nuts), water, and replacement activities (light exercise, hobbies). Symptoms reduce in 2-4 weeks.",
    "quit.step5.tip": "💡 Tip: Deep breathing and meditation very effective in reducing stress and smoking urges.",
    "quit.step6": "6. Stay Motivated & Track Progress",
    "quit.step6.desc":
      "Remember your reasons: health, family, finances. Count money you save daily. Celebrate small milestones!",
    "quit.step6.tip": "💡 Tip: List benefits you've experienced (easier breathing, better stamina, clearer skin).",

    "quit.benefits.title": "Benefits of Quitting Smoking",
    "quit.benefits.subtitle": "Your body starts healing from first minute. Here's timeline you'll experience:",
    "quit.timeline.20min": "20 Minutes",
    "quit.timeline.20min.desc": "Heart rate and blood pressure return to normal.",
    "quit.timeline.12hr": "12 Hours",
    "quit.timeline.12hr.desc": "Carbon monoxide levels in blood drop to normal.",
    "quit.timeline.2wk": "2-12 Weeks",
    "quit.timeline.2wk.desc": "Blood circulation improves, lung function significantly increases.",
    "quit.timeline.1yr": "1 Year",
    "quit.timeline.1yr.desc": "Coronary heart disease risk drops by 50%.",
    "quit.timeline.5yr": "5 Years",
    "quit.timeline.5yr.desc": "Stroke risk drops equal to non-smokers.",
    "quit.timeline.10yr": "10 Years",
    "quit.timeline.10yr.desc": "Lung cancer risk drops by 50% compared to active smokers.",

    "quit.share.title": "Share This Page",
    "quit.share.desc": "You can help others quit smoking by sharing this information. One share can save lives!",
    "quit.share.button": "Share with Friends & Family",

    // Quiz
    "quiz.title": "Smoking Knowledge Quiz",
    "quiz.question": "Question",
    "quiz.score": "Score",
    "quiz.start": "Start Quiz",
    "quiz.result.title": "Your Quiz Results",
    "quiz.result.perfect": "Outstanding! You really understand the dangers.",
    "quiz.result.good": "Good job! You know most of the risks.",
    "quiz.result.poor": "Need to learn more. The dangers are more serious than you think.",
    "quiz.retry": "Try Again",

    "quiz.q1": "How many harmful chemicals are in a single cigarette?",
    "quiz.q1.a": "100-200",
    "quiz.q1.b": "500-1,000",
    "quiz.q1.c": "4,000-7,000",
    "quiz.q1.d": "More than 7,000",
    "quiz.q1.expl": "Cigarette smoke contains over 7,000 chemicals, 250 of which are harmful and 69 cause cancer.",

    "quiz.q2": "Which organ is damaged first by smoking?",
    "quiz.q2.a": "Heart",
    "quiz.q2.b": "Lungs",
    "quiz.q2.c": "Stomach",
    "quiz.q2.d": "All of them",
    "quiz.q2.expl":
      "Smoke goes directly to lungs, but toxins spread through blood damaging almost every organ simultaneously.",

    "quiz.q3": "What is nicotine's effect on teenage brains?",
    "quiz.q3.a": "Increases IQ",
    "quiz.q3.b": "Disrupts brain development",
    "quiz.q3.c": "Makes them more mature",
    "quiz.q3.d": "No effect",
    "quiz.q3.expl":
      "Teen brains develop until 25. Nicotine disrupts synapse formation controlling attention and learning.",

    "quiz.q4": "How long does nicotine take to reach the brain?",
    "quiz.q4.a": "1 minute",
    "quiz.q4.b": "10 seconds",
    "quiz.q4.c": "5 minutes",
    "quiz.q4.d": "1 hour",
    "quiz.q4.expl":
      "Very fast! Within 10 seconds of inhaling, nicotine hits the brain triggering dopamine, causing rapid addiction.",

    "quiz.q5": "What disease do passive smoking children suffer most?",
    "quiz.q5.a": "Asthma & Ear Infections",
    "quiz.q5.b": "Diabetes",
    "quiz.q5.c": "Rheumatism",
    "quiz.q5.d": "Toothache",
    "quiz.q5.expl":
      "Children exposed to secondhand smoke have high risk of acute asthma, ear infections, and respiratory issues.",

    // Testimonials
    "testimonials.title": "They Did It, So Can You!",
    "testimonials.subtitle": "Real stories from people who escaped the smoking trap.",
    "testimonial.source": "Source: Indonesian Heart Foundation & Quit Smoking Community",
    "testimonial.1.name": "Budi Santoso, 38 years old",
    "testimonial.1.location": "Jakarta",
    "testimonial.1.years": "Smoked for 15 years",
    "testimonial.1.quote":
      "I used to smoke 2 packs a day. After my first child was born, I realized I wanted to see him grow up. Been smoke-free for 3 years now, breathing easy, and saved millions!",
    "testimonial.2.name": "Siti Aminah, 45 years old",
    "testimonial.2.location": "Surabaya",
    "testimonial.2.years": "Smoked for 20 years",
    "testimonial.2.quote":
      "I thought I couldn't quit. But after COPD diagnosis, I had to choose: cigarettes or life. With family support and NRT, I succeeded! Now I can walk without gasping for air.",
    "testimonial.3.name": "Andi Wijaya, 29 years old",
    "testimonial.3.location": "Bandung",
    "testimonial.3.years": "Smoked for 10 years",
    "testimonial.3.quote":
      "As freelancer, I was stressed and cigarettes were escape. After joining quit program, I replaced with exercise. Productivity up, health improved, and most importantly: I'm free from addiction!",

    // Footer
    "footer.hotline": "Quit Smoking Hotline: 0-800-177-6565",
    "footer.source": "Source: WHO & Ministry of Health",
    "footer.copyright": "© 2025 WEROK. Indonesian Anti-Smoking Education Platform.",
    "footer.tagline": "Interactive educational platform for a healthy smoke-free life.",

    // Calculator
    "calc.title": "Savings Calculator",
    "calc.subtitle": "See how much money (and life) you are burning.",
    "calc.label.packs": "Packs per day",
    "calc.label.price": "Price per pack (Rp)",
    "calc.label.years": "Years smoking",
    "calc.result.money": "Money Burned",
    "calc.result.time": "Time Wasted",
    "calc.desc": "If you invested this money, you could buy:",
    "calc.item.house": "House Down Payment",
    "calc.item.car": "New Car",
    "calc.item.umrah": "Umrah Package",
    "calc.item.laptop": "Gaming Laptop",
  },
}

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("id")

  const t = (key: string) => {
    // @ts-ignore
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
