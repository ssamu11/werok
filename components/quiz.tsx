"use client"

import { useState } from "react"
import { useLanguage } from "@/components/providers/language-provider"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, RefreshCw, Trophy, BookOpen, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Quiz() {
  const { t } = useLanguage()
  const [started, setStarted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)

  const questions = [
    {
      q: "quiz.q1",
      answers: ["quiz.q1.a", "quiz.q1.b", "quiz.q1.c", "quiz.q1.d"],
      correct: 3,
      explanation: "quiz.q1.expl",
    },
    {
      q: "quiz.q2",
      answers: ["quiz.q2.a", "quiz.q2.b", "quiz.q2.c", "quiz.q2.d"],
      correct: 3, // All of them
      explanation: "quiz.q2.expl",
    },
    {
      q: "quiz.q3",
      answers: ["quiz.q3.a", "quiz.q3.b", "quiz.q3.c", "quiz.q3.d"],
      correct: 1,
      explanation: "quiz.q3.expl",
    },
    {
      q: "quiz.q4",
      answers: ["quiz.q4.a", "quiz.q4.b", "quiz.q4.c", "quiz.q4.d"],
      correct: 1,
      explanation: "quiz.q4.expl",
    },
    {
      q: "quiz.q5",
      answers: ["quiz.q5.a", "quiz.q5.b", "quiz.q5.c", "quiz.q5.d"],
      correct: 0,
      explanation: "quiz.q5.expl",
    },
  ]

  const handleStart = () => {
    setStarted(true)
    setCurrentQ(0)
    setScore(0)
    setShowResult(false)
    setIsAnswered(false)
    setSelectedAnswer(null)
  }

  const handleAnswer = (idx: number) => {
    if (isAnswered) return
    setSelectedAnswer(idx)
    setIsAnswered(true)

    if (idx === questions[currentQ].correct) {
      setScore((s) => s + 1)
    }
  }

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1)
      setIsAnswered(false)
      setSelectedAnswer(null)
    } else {
      setShowResult(true)
    }
  }

  return (
    <section id="quiz" className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <span className="text-red-600 font-semibold uppercase tracking-wider text-sm">{t("nav.quiz")}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2">{t("quiz.title")}</h2>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 md:p-12 min-h-[500px] flex flex-col justify-center items-center transition-all duration-300">
          {!started ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto text-red-600 dark:text-red-400 mb-6 shadow-lg shadow-red-500/20">
                <BookOpen className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Siap Menguji Pengetahuanmu?</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md mx-auto">
                Jawab 5 pertanyaan singkat untuk melihat seberapa jauh kamu memahami bahaya rokok.
              </p>
              <Button
                onClick={handleStart}
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white rounded-full px-10 py-6 text-lg shadow-lg hover:shadow-red-500/30 transition-all hover:-translate-y-1"
              >
                {t("quiz.start")}
              </Button>
            </motion.div>
          ) : showResult ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8 w-full"
            >
              <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto text-yellow-600 dark:text-yellow-400 mb-6 shadow-lg shadow-yellow-500/20">
                <Trophy className="h-10 w-10" />
              </div>

              <div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t("quiz.result.title")}</h3>
                <div className="text-5xl font-extrabold text-red-500 mb-2">
                  {score * 20} <span className="text-2xl text-slate-400 font-medium">/ 100</span>
                </div>
                <div className="inline-block px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                  {score === questions.length
                    ? t("quiz.result.perfect")
                    : score >= 3
                      ? t("quiz.result.good")
                      : t("quiz.result.poor")}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-xl text-left border border-slate-100 dark:border-slate-600">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Rekomendasi Langkah Selanjutnya:</h4>
                <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                  <li>
                    Baca ulang bagian{" "}
                    <a href="#impacts" className="text-red-500 font-medium hover:underline">
                      Dampak Bagi Tubuh
                    </a>
                  </li>
                  <li>
                    Pelajari{" "}
                    <a href="#myths" className="text-red-500 font-medium hover:underline">
                      Mitos vs Fakta
                    </a>{" "}
                    lebih dalam
                  </li>
                  <li>Bagikan skor ini ke temanmu!</li>
                </ul>
              </div>

              <Button
                onClick={handleStart}
                variant="outline"
                size="lg"
                className="gap-2 rounded-full border-2 hover:bg-slate-100 dark:hover:bg-slate-700 bg-transparent"
              >
                <RefreshCw className="h-4 w-4" />
                {t("quiz.retry")}
              </Button>
            </motion.div>
          ) : (
            <div className="w-full max-w-lg space-y-8">
              <div className="flex justify-between items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                <span>
                  {t("quiz.question")} {currentQ + 1} of {questions.length}
                </span>
                <span className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-xs">
                  {t("quiz.score")}: {score * 20}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-red-500 h-full transition-all duration-300 ease-out"
                  style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                />
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white text-center min-h-[3.5rem] flex items-center justify-center">
                {t(questions[currentQ].q)}
              </h3>

              <div className="grid gap-3">
                {questions[currentQ].answers.map((ans, idx) => {
                  const isSelected = selectedAnswer === idx
                  const isCorrect = idx === questions[currentQ].correct
                  let btnClass =
                    "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-700 hover:border-red-400 dark:hover:border-red-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"

                  if (isAnswered) {
                    if (isCorrect)
                      btnClass = "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400"
                    else if (isSelected)
                      btnClass = "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400"
                    else
                      btnClass =
                        "bg-white/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 opacity-50"
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded-xl text-left font-medium transition-all duration-200 flex items-center justify-between shadow-sm ${btnClass}`}
                    >
                      <span>{t(ans)}</span>
                      {isAnswered && isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {isAnswered && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                    </button>
                  )
                })}
              </div>

              {/* Feedback Section */}
              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`p-4 rounded-xl border ${
                      selectedAnswer === questions[currentQ].correct
                        ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                        : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                    }`}
                  >
                    <div className="flex gap-3">
                      <AlertCircle
                        className={`h-5 w-5 flex-shrink-0 ${
                          selectedAnswer === questions[currentQ].correct ? "text-green-600" : "text-red-600"
                        }`}
                      />
                      <div>
                        <p
                          className={`font-bold mb-1 ${
                            selectedAnswer === questions[currentQ].correct
                              ? "text-green-700 dark:text-green-400"
                              : "text-red-700 dark:text-red-400"
                          }`}
                        >
                          {selectedAnswer === questions[currentQ].correct ? "Benar!" : "Kurang Tepat!"}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {t(questions[currentQ].explanation)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button
                        onClick={handleNext}
                        size="sm"
                        className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                      >
                        Lanjut <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
