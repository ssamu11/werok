"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  Shield,
  Play,
  RotateCcw,
  Trophy,
  Skull,
  Volume2,
  VolumeX,
  Zap,
  AlertTriangle,
  Info,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/providers/language-provider"

// ===========================================
// TYPES & INTERFACES
// ===========================================
interface GameObject {
  id: string
  type: "smoke" | "smoke-fast" | "smoke-big" | "smoke-zigzag" | "tar" | "cigarette" | "fresh-air" | "medicine"
  x: number
  y: number
  speed: number
  size: number
  opacity: number
  zigzagPhase?: number
  zigzagAmplitude?: number
  zigzagFrequency?: number
}

interface Particle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

interface FloatingText {
  id: string
  x: number
  y: number
  text: string
  color: string
  life: number
}

interface GameStats {
  smokeBlocked: number
  tarAbsorbed: number
  totalDamage: number
  powerupsCollected: number
}

type GameState = "idle" | "playing" | "paused" | "gameover" | "levelup"
type GameMode = "endless" | "survival"

// ===========================================
// GAME CONSTANTS
// ===========================================
const GAME_WIDTH = 600
const GAME_HEIGHT = 500
const SHIELD_WIDTH = 100
const SHIELD_HEIGHT = 14
const SHIELD_Y = GAME_HEIGHT - 80
const LUNG_Y = GAME_HEIGHT - 45

const getSpawnRate = (level: number) => Math.max(400, 800 - level * 40)

// Level speed ranges (px/s) - increased for intensity
const LEVEL_SPEEDS: Record<number, { min: number; max: number }> = {
  1: { min: 140, max: 200 },
  2: { min: 180, max: 250 },
  3: { min: 220, max: 300 },
  4: { min: 260, max: 350 },
  5: { min: 300, max: 400 },
  6: { min: 340, max: 450 },
  7: { min: 380, max: 500 },
  8: { min: 420, max: 550 },
  9: { min: 460, max: 600 },
  10: { min: 500, max: 650 },
}

const LEVEL_DURATION = 30000 // 30 seconds per level

const FACTS = {
  id: [
    "Asap rokok mengandung lebih dari 7.000 bahan kimia berbahaya, 70 di antaranya menyebabkan kanker.",
    "Tar dalam rokok bisa menurunkan kapasitas paru-paru hingga 30% dalam 10 tahun.",
    "Satu batang rokok mengandung sekitar 4.800 bahan kimia beracun.",
    "Perokok pasif menerima 15% lebih banyak karbon monoksida dibanding perokok aktif.",
    "Berhenti merokok 1 tahun menurunkan risiko penyakit jantung hingga 50%.",
    "Nikotin mencapai otak hanya dalam 10 detik setelah menghisap rokok.",
    "Rokok menyebabkan 90% kasus kanker paru-paru di seluruh dunia.",
    "Setelah 20 menit berhenti merokok, detak jantung mulai kembali normal.",
    "Perokok kehilangan rata-rata 10 tahun harapan hidup dibanding non-perokok.",
    "Indonesia adalah negara dengan perokok terbanyak ke-3 di dunia.",
  ],
  en: [
    "Cigarette smoke contains over 7,000 harmful chemicals, 70 of which cause cancer.",
    "Tar in cigarettes can reduce lung capacity by up to 30% within 10 years.",
    "A single cigarette contains about 4,800 toxic chemicals.",
    "Passive smokers receive 15% more carbon monoxide than active smokers.",
    "Quitting smoking for 1 year reduces heart disease risk by up to 50%.",
    "Nicotine reaches the brain within just 10 seconds of inhaling.",
    "Smoking causes 90% of lung cancer cases worldwide.",
    "After 20 minutes of quitting, heart rate begins to normalize.",
    "Smokers lose an average of 10 years of life expectancy compared to non-smokers.",
    "Indonesia has the 3rd highest number of smokers in the world.",
  ],
}

// ===========================================
// MAIN COMPONENT
// ===========================================
export default function Minigame() {
  const { language } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const spawnTimerRef = useRef<number>(0)
  const levelTimerRef = useRef<number>(0)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Game state
  const [gameState, setGameState] = useState<GameState>("idle")
  const [gameMode, setGameMode] = useState<GameMode>("endless")
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [health, setHealth] = useState(100)
  const [tarMeter, setTarMeter] = useState(0)
  const [level, setLevel] = useState(1)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [currentFact, setCurrentFact] = useState("")
  const [survivalTime, setSurvivalTime] = useState(0)
  const [showDamageFlash, setShowDamageFlash] = useState(false)
  const [screenShake, setScreenShake] = useState(0)
  const [stats, setStats] = useState<GameStats>({
    smokeBlocked: 0,
    tarAbsorbed: 0,
    totalDamage: 0,
    powerupsCollected: 0,
  })

  // Game objects (stored in refs for performance)
  const objectsRef = useRef<GameObject[]>([])
  const particlesRef = useRef<Particle[]>([])
  const floatingTextsRef = useRef<FloatingText[]>([])
  const shieldXRef = useRef(GAME_WIDTH / 2)
  const targetShieldXRef = useRef(GAME_WIDTH / 2)
  const healthRef = useRef(100)
  const tarRef = useRef(0)
  const scoreRef = useRef(0)
  const comboRef = useRef(0)
  const levelRef = useRef(1)
  const gameTimeRef = useRef(0)

  // Scale for responsive canvas
  const [scale, setScale] = useState(1)

  // ===========================================
  // AUDIO SYSTEM
  // ===========================================
  const playSound = useCallback(
    (type: "block" | "damage" | "powerup" | "levelup" | "gameover") => {
      if (!soundEnabled) return

      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        }

        const ctx = audioContextRef.current
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)

        switch (type) {
          case "block":
            oscillator.frequency.setValueAtTime(600, ctx.currentTime)
            oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1)
            gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
            oscillator.start(ctx.currentTime)
            oscillator.stop(ctx.currentTime + 0.1)
            break
          case "damage":
            oscillator.frequency.setValueAtTime(200, ctx.currentTime)
            oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2)
            gainNode.gain.setValueAtTime(0.15, ctx.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
            oscillator.start(ctx.currentTime)
            oscillator.stop(ctx.currentTime + 0.2)
            break
          case "powerup":
            oscillator.frequency.setValueAtTime(400, ctx.currentTime)
            oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15)
            gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
            oscillator.start(ctx.currentTime)
            oscillator.stop(ctx.currentTime + 0.15)
            break
          case "levelup":
            oscillator.frequency.setValueAtTime(300, ctx.currentTime)
            oscillator.frequency.setValueAtTime(450, ctx.currentTime + 0.1)
            oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.2)
            gainNode.gain.setValueAtTime(0.12, ctx.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
            oscillator.start(ctx.currentTime)
            oscillator.stop(ctx.currentTime + 0.3)
            break
          case "gameover":
            oscillator.frequency.setValueAtTime(400, ctx.currentTime)
            oscillator.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.5)
            gainNode.gain.setValueAtTime(0.15, ctx.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
            oscillator.start(ctx.currentTime)
            oscillator.stop(ctx.currentTime + 0.5)
            break
        }
      } catch (e) {
        // Audio not supported
      }
    },
    [soundEnabled],
  )

  // ===========================================
  // PARTICLE SYSTEM
  // ===========================================
  const createParticles = useCallback((x: number, y: number, type: "smoke" | "air" | "heal" | "damage") => {
    const colors = {
      smoke: ["#6b7280", "#4b5563", "#374151", "#9ca3af"],
      air: ["#22d3ee", "#06b6d4", "#0891b2", "#67e8f9"],
      heal: ["#22c55e", "#16a34a", "#15803d", "#4ade80"],
      damage: ["#ef4444", "#dc2626", "#b91c1c", "#f87171"],
    }

    const count = type === "damage" ? 20 : 12

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
      const speed = 80 + Math.random() * 150

      particlesRef.current.push({
        id: `p-${Date.now()}-${i}-${Math.random()}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 80,
        life: 1,
        maxLife: 0.6 + Math.random() * 0.6,
        color: colors[type][Math.floor(Math.random() * colors[type].length)],
        size: 4 + Math.random() * 6,
      })
    }
  }, [])

  const createFloatingText = useCallback((x: number, y: number, text: string, color: string) => {
    floatingTextsRef.current.push({
      id: `ft-${Date.now()}-${Math.random()}`,
      x,
      y,
      text,
      color,
      life: 1,
    })
  }, [])

  // ===========================================
  // SPAWN SYSTEM with variations
  // ===========================================
  const spawnObject = useCallback(() => {
    const lvl = levelRef.current
    const speedRange = LEVEL_SPEEDS[Math.min(lvl, 10)]
    const baseSpeed = speedRange.min + Math.random() * (speedRange.max - speedRange.min)

    const rand = Math.random()
    let type: GameObject["type"]
    let speed = baseSpeed
    let size = 28

    const smokeFastProb = 0.15 + lvl * 0.01
    const smokeBigProb = smokeFastProb + 0.12 + lvl * 0.01
    const smokeZigzagProb = smokeBigProb + 0.1 + lvl * 0.01
    const smokeNormalProb = smokeZigzagProb + 0.15
    const tarProb = smokeNormalProb + 0.18 + lvl * 0.01
    const cigProb = tarProb + 0.1 + lvl * 0.005
    const freshAirProb = cigProb + 0.12 - lvl * 0.008

    if (rand < smokeFastProb) {
      type = "smoke-fast"
      speed = baseSpeed * 1.8
      size = 22
    } else if (rand < smokeBigProb) {
      type = "smoke-big"
      speed = baseSpeed * 0.6
      size = 42
    } else if (rand < smokeZigzagProb) {
      type = "smoke-zigzag"
      speed = baseSpeed * 0.9
      size = 26
    } else if (rand < smokeNormalProb) {
      type = "smoke"
      size = 28
    } else if (rand < tarProb) {
      type = "tar"
      size = 34
    } else if (rand < cigProb) {
      type = "cigarette"
      size = 38
    } else if (rand < freshAirProb) {
      type = "fresh-air"
      size = 28
    } else {
      type = "medicine"
      size = 26
    }

    const obj: GameObject = {
      id: `obj-${Date.now()}-${Math.random()}`,
      type,
      x: 40 + Math.random() * (GAME_WIDTH - 80),
      y: -40,
      speed,
      size,
      opacity: 1,
    }

    if (type === "smoke-zigzag") {
      obj.zigzagPhase = Math.random() * Math.PI * 2
      obj.zigzagAmplitude = 40 + Math.random() * 30
      obj.zigzagFrequency = 3 + Math.random() * 2
    }

    objectsRef.current.push(obj)
  }, [])

  // ===========================================
  // ===========================================
  const drawRealisticLungs = useCallback((ctx: CanvasRenderingContext2D, health: number, tar: number) => {
    const centerX = GAME_WIDTH / 2
    const lungY = LUNG_Y
    const scale = 1.2 // Slightly larger for better visibility

    // Calculate lung color based on health and tar
    const healthFactor = health / 100
    const tarFactor = tar / 100

    // Healthy = soft pink pastel, damaged = brownish/gray
    const baseR = 245
    const baseG = 180
    const baseB = 185

    const r = Math.floor(baseR - tarFactor * 140)
    const g = Math.floor(baseG - tarFactor * 120 + healthFactor * 15)
    const b = Math.floor(baseB - tarFactor * 130)
    const lungColor = `rgb(${r}, ${g}, ${b})`

    const darkerLung = `rgb(${Math.floor(r * 0.75)}, ${Math.floor(g * 0.75)}, ${Math.floor(b * 0.75)})`
    const highlightLung = `rgb(${Math.min(255, r + 25)}, ${Math.min(255, g + 30)}, ${Math.min(255, b + 30)})`
    const shadowLung = `rgb(${Math.floor(r * 0.6)}, ${Math.floor(g * 0.6)}, ${Math.floor(b * 0.6)})`
    const outlineColor = `rgba(${Math.floor(r * 0.5)}, ${Math.floor(g * 0.5)}, ${Math.floor(b * 0.5)}, 0.6)`

    ctx.save()

    // ===========================================
    // TRACHEA (Windpipe) - Cartilage rings style
    // ===========================================
    const tracheaX = centerX
    const tracheaTop = lungY - 50 * scale
    const tracheaWidth = 14 * scale
    const tracheaHeight = 45 * scale

    // Trachea shadow
    ctx.fillStyle = shadowLung
    ctx.beginPath()
    ctx.roundRect(tracheaX - tracheaWidth / 2 + 2, tracheaTop + 2, tracheaWidth, tracheaHeight, 4)
    ctx.fill()

    // Trachea main body
    const tracheaGradient = ctx.createLinearGradient(tracheaX - tracheaWidth / 2, 0, tracheaX + tracheaWidth / 2, 0)
    tracheaGradient.addColorStop(0, darkerLung)
    tracheaGradient.addColorStop(0.3, lungColor)
    tracheaGradient.addColorStop(0.7, lungColor)
    tracheaGradient.addColorStop(1, darkerLung)
    ctx.fillStyle = tracheaGradient
    ctx.beginPath()
    ctx.roundRect(tracheaX - tracheaWidth / 2, tracheaTop, tracheaWidth, tracheaHeight, 4)
    ctx.fill()

    // Trachea cartilage rings
    ctx.strokeStyle = darkerLung
    ctx.lineWidth = 1.5
    for (let i = 0; i < 6; i++) {
      const ringY = tracheaTop + 8 + i * 7 * scale
      ctx.beginPath()
      ctx.moveTo(tracheaX - tracheaWidth / 2 + 2, ringY)
      ctx.lineTo(tracheaX + tracheaWidth / 2 - 2, ringY)
      ctx.stroke()
    }

    // Trachea outline
    ctx.strokeStyle = outlineColor
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.roundRect(tracheaX - tracheaWidth / 2, tracheaTop, tracheaWidth, tracheaHeight, 4)
    ctx.stroke()

    // ===========================================
    // MAIN BRONCHI (Y-split)
    // ===========================================
    const bronchiY = tracheaTop + tracheaHeight

    // Left main bronchus
    ctx.fillStyle = darkerLung
    ctx.beginPath()
    ctx.moveTo(centerX - 5, bronchiY)
    ctx.quadraticCurveTo(centerX - 25 * scale, bronchiY + 15 * scale, centerX - 40 * scale, bronchiY + 20 * scale)
    ctx.lineTo(centerX - 35 * scale, bronchiY + 25 * scale)
    ctx.quadraticCurveTo(centerX - 20 * scale, bronchiY + 20 * scale, centerX + 5, bronchiY + 8)
    ctx.closePath()
    ctx.fill()

    // Right main bronchus
    ctx.beginPath()
    ctx.moveTo(centerX + 5, bronchiY)
    ctx.quadraticCurveTo(centerX + 25 * scale, bronchiY + 15 * scale, centerX + 40 * scale, bronchiY + 20 * scale)
    ctx.lineTo(centerX + 35 * scale, bronchiY + 25 * scale)
    ctx.quadraticCurveTo(centerX + 20 * scale, bronchiY + 20 * scale, centerX - 5, bronchiY + 8)
    ctx.closePath()
    ctx.fill()

    // ===========================================
    // LEFT LUNG - Anatomically shaped (2 lobes)
    // ===========================================
    const leftLungX = centerX - 55 * scale
    const lungBaseY = lungY + 5

    // Left lung shadow
    ctx.fillStyle = `rgba(0,0,0,0.15)`
    ctx.beginPath()
    ctx.moveTo(centerX - 18 * scale, lungBaseY - 15 * scale)
    // Upper lobe top curve
    ctx.bezierCurveTo(
      centerX - 30 * scale,
      lungBaseY - 35 * scale,
      centerX - 65 * scale,
      lungBaseY - 40 * scale,
      centerX - 85 * scale,
      lungBaseY - 25 * scale,
    )
    // Outer left edge
    ctx.bezierCurveTo(
      centerX - 100 * scale,
      lungBaseY - 5 * scale,
      centerX - 105 * scale,
      lungBaseY + 25 * scale,
      centerX - 95 * scale,
      lungBaseY + 45 * scale,
    )
    // Bottom curve
    ctx.bezierCurveTo(
      centerX - 80 * scale,
      lungBaseY + 60 * scale,
      centerX - 45 * scale,
      lungBaseY + 58 * scale,
      centerX - 25 * scale,
      lungBaseY + 45 * scale,
    )
    // Inner mediastinal curve (concave for heart space)
    ctx.bezierCurveTo(
      centerX - 15 * scale,
      lungBaseY + 30 * scale,
      centerX - 12 * scale,
      lungBaseY + 10 * scale,
      centerX - 18 * scale,
      lungBaseY - 15 * scale,
    )
    ctx.closePath()
    ctx.fill()

    // Left lung main body with gradient
    const leftLungGradient = ctx.createRadialGradient(
      leftLungX + 10,
      lungBaseY + 5,
      5,
      leftLungX,
      lungBaseY + 15,
      70 * scale,
    )
    leftLungGradient.addColorStop(0, highlightLung)
    leftLungGradient.addColorStop(0.4, lungColor)
    leftLungGradient.addColorStop(1, darkerLung)

    ctx.fillStyle = leftLungGradient
    ctx.beginPath()
    ctx.moveTo(centerX - 20 * scale, lungBaseY - 18 * scale)
    // Upper lobe top curve - more natural shape
    ctx.bezierCurveTo(
      centerX - 32 * scale,
      lungBaseY - 38 * scale,
      centerX - 68 * scale,
      lungBaseY - 42 * scale,
      centerX - 88 * scale,
      lungBaseY - 28 * scale,
    )
    // Outer left edge with natural bulge
    ctx.bezierCurveTo(
      centerX - 102 * scale,
      lungBaseY - 8 * scale,
      centerX - 107 * scale,
      lungBaseY + 22 * scale,
      centerX - 97 * scale,
      lungBaseY + 42 * scale,
    )
    // Bottom curve - rounded base
    ctx.bezierCurveTo(
      centerX - 82 * scale,
      lungBaseY + 58 * scale,
      centerX - 48 * scale,
      lungBaseY + 55 * scale,
      centerX - 28 * scale,
      lungBaseY + 42 * scale,
    )
    // Inner mediastinal curve (cardiac notch - indentation for heart)
    ctx.bezierCurveTo(
      centerX - 18 * scale,
      lungBaseY + 28 * scale,
      centerX - 15 * scale,
      lungBaseY + 8 * scale,
      centerX - 20 * scale,
      lungBaseY - 18 * scale,
    )
    ctx.closePath()
    ctx.fill()

    // Left lung oblique fissure (separates upper and lower lobes)
    ctx.strokeStyle = darkerLung
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX - 45 * scale, lungBaseY - 25 * scale)
    ctx.quadraticCurveTo(centerX - 70 * scale, lungBaseY + 15 * scale, centerX - 35 * scale, lungBaseY + 45 * scale)
    ctx.stroke()

    // Left lung highlight (upper area)
    ctx.fillStyle = `rgba(255,255,255,0.25)`
    ctx.beginPath()
    ctx.ellipse(centerX - 60 * scale, lungBaseY - 15 * scale, 18 * scale, 12 * scale, -0.4, 0, Math.PI * 2)
    ctx.fill()

    // Left lung outline
    ctx.strokeStyle = outlineColor
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX - 20 * scale, lungBaseY - 18 * scale)
    ctx.bezierCurveTo(
      centerX - 32 * scale,
      lungBaseY - 38 * scale,
      centerX - 68 * scale,
      lungBaseY - 42 * scale,
      centerX - 88 * scale,
      lungBaseY - 28 * scale,
    )
    ctx.bezierCurveTo(
      centerX - 102 * scale,
      lungBaseY - 8 * scale,
      centerX - 107 * scale,
      lungBaseY + 22 * scale,
      centerX - 97 * scale,
      lungBaseY + 42 * scale,
    )
    ctx.bezierCurveTo(
      centerX - 82 * scale,
      lungBaseY + 58 * scale,
      centerX - 48 * scale,
      lungBaseY + 55 * scale,
      centerX - 28 * scale,
      lungBaseY + 42 * scale,
    )
    ctx.bezierCurveTo(
      centerX - 18 * scale,
      lungBaseY + 28 * scale,
      centerX - 15 * scale,
      lungBaseY + 8 * scale,
      centerX - 20 * scale,
      lungBaseY - 18 * scale,
    )
    ctx.stroke()

    // ===========================================
    // RIGHT LUNG - Anatomically shaped (3 lobes)
    // ===========================================
    const rightLungX = centerX + 55 * scale

    // Right lung shadow
    ctx.fillStyle = `rgba(0,0,0,0.15)`
    ctx.beginPath()
    ctx.moveTo(centerX + 18 * scale + 3, lungBaseY - 15 * scale + 3)
    ctx.bezierCurveTo(
      centerX + 30 * scale + 3,
      lungBaseY - 35 * scale + 3,
      centerX + 65 * scale + 3,
      lungBaseY - 40 * scale + 3,
      centerX + 85 * scale + 3,
      lungBaseY - 25 * scale + 3,
    )
    ctx.bezierCurveTo(
      centerX + 100 * scale + 3,
      lungBaseY - 5 * scale + 3,
      centerX + 105 * scale + 3,
      lungBaseY + 25 * scale + 3,
      centerX + 95 * scale + 3,
      lungBaseY + 45 * scale + 3,
    )
    ctx.bezierCurveTo(
      centerX + 80 * scale + 3,
      lungBaseY + 60 * scale + 3,
      centerX + 45 * scale + 3,
      lungBaseY + 58 * scale + 3,
      centerX + 25 * scale + 3,
      lungBaseY + 45 * scale + 3,
    )
    ctx.bezierCurveTo(
      centerX + 15 * scale + 3,
      lungBaseY + 30 * scale + 3,
      centerX + 12 * scale + 3,
      lungBaseY + 10 * scale + 3,
      centerX + 18 * scale + 3,
      lungBaseY - 15 * scale + 3,
    )
    ctx.closePath()
    ctx.fill()

    // Right lung main body with gradient
    const rightLungGradient = ctx.createRadialGradient(
      rightLungX - 10,
      lungBaseY + 5,
      5,
      rightLungX,
      lungBaseY + 15,
      70 * scale,
    )
    rightLungGradient.addColorStop(0, highlightLung)
    rightLungGradient.addColorStop(0.4, lungColor)
    rightLungGradient.addColorStop(1, darkerLung)

    ctx.fillStyle = rightLungGradient
    ctx.beginPath()
    ctx.moveTo(centerX + 20 * scale, lungBaseY - 18 * scale)
    // Upper lobe top curve
    ctx.bezierCurveTo(
      centerX + 32 * scale,
      lungBaseY - 38 * scale,
      centerX + 68 * scale,
      lungBaseY - 42 * scale,
      centerX + 88 * scale,
      lungBaseY - 28 * scale,
    )
    // Outer right edge
    ctx.bezierCurveTo(
      centerX + 102 * scale,
      lungBaseY - 8 * scale,
      centerX + 107 * scale,
      lungBaseY + 22 * scale,
      centerX + 97 * scale,
      lungBaseY + 42 * scale,
    )
    // Bottom curve
    ctx.bezierCurveTo(
      centerX + 82 * scale,
      lungBaseY + 58 * scale,
      centerX + 48 * scale,
      lungBaseY + 55 * scale,
      centerX + 28 * scale,
      lungBaseY + 42 * scale,
    )
    // Inner mediastinal curve
    ctx.bezierCurveTo(
      centerX + 18 * scale,
      lungBaseY + 28 * scale,
      centerX + 15 * scale,
      lungBaseY + 8 * scale,
      centerX + 20 * scale,
      lungBaseY - 18 * scale,
    )
    ctx.closePath()
    ctx.fill()

    // Right lung horizontal fissure (separates upper and middle lobes)
    ctx.strokeStyle = darkerLung
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX + 25 * scale, lungBaseY - 5 * scale)
    ctx.quadraticCurveTo(centerX + 60 * scale, lungBaseY - 8 * scale, centerX + 90 * scale, lungBaseY - 12 * scale)
    ctx.stroke()

    // Right lung oblique fissure (separates middle and lower lobes)
    ctx.beginPath()
    ctx.moveTo(centerX + 50 * scale, lungBaseY - 28 * scale)
    ctx.quadraticCurveTo(centerX + 75 * scale, lungBaseY + 15 * scale, centerX + 38 * scale, lungBaseY + 48 * scale)
    ctx.stroke()

    // Right lung highlight
    ctx.fillStyle = `rgba(255,255,255,0.25)`
    ctx.beginPath()
    ctx.ellipse(centerX + 60 * scale, lungBaseY - 15 * scale, 18 * scale, 12 * scale, 0.4, 0, Math.PI * 2)
    ctx.fill()

    // Right lung outline
    ctx.strokeStyle = outlineColor
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX + 20 * scale, lungBaseY - 18 * scale)
    ctx.bezierCurveTo(
      centerX + 32 * scale,
      lungBaseY - 38 * scale,
      centerX + 68 * scale,
      lungBaseY - 42 * scale,
      centerX + 88 * scale,
      lungBaseY - 28 * scale,
    )
    ctx.bezierCurveTo(
      centerX + 102 * scale,
      lungBaseY - 8 * scale,
      centerX + 107 * scale,
      lungBaseY + 22 * scale,
      centerX + 97 * scale,
      lungBaseY + 42 * scale,
    )
    ctx.bezierCurveTo(
      centerX + 82 * scale,
      lungBaseY + 58 * scale,
      centerX + 48 * scale,
      lungBaseY + 55 * scale,
      centerX + 28 * scale,
      lungBaseY + 42 * scale,
    )
    ctx.bezierCurveTo(
      centerX + 18 * scale,
      lungBaseY + 28 * scale,
      centerX + 15 * scale,
      lungBaseY + 8 * scale,
      centerX + 20 * scale,
      lungBaseY - 18 * scale,
    )
    ctx.stroke()

    // ===========================================
    // BRONCHIAL TREE (inside lungs)
    // ===========================================
    ctx.strokeStyle = darkerLung
    ctx.lineCap = "round"

    // Left bronchial branches
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(centerX - 35 * scale, bronchiY + 22 * scale)
    ctx.quadraticCurveTo(centerX - 50 * scale, lungBaseY + 5 * scale, centerX - 60 * scale, lungBaseY + 15 * scale)
    ctx.stroke()

    ctx.lineWidth = 2
    // Upper branch
    ctx.beginPath()
    ctx.moveTo(centerX - 45 * scale, lungBaseY)
    ctx.quadraticCurveTo(centerX - 55 * scale, lungBaseY - 15 * scale, centerX - 70 * scale, lungBaseY - 20 * scale)
    ctx.stroke()
    // Lower branch
    ctx.beginPath()
    ctx.moveTo(centerX - 55 * scale, lungBaseY + 12 * scale)
    ctx.quadraticCurveTo(centerX - 65 * scale, lungBaseY + 25 * scale, centerX - 75 * scale, lungBaseY + 35 * scale)
    ctx.stroke()

    // Right bronchial branches
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(centerX + 35 * scale, bronchiY + 22 * scale)
    ctx.quadraticCurveTo(centerX + 50 * scale, lungBaseY + 5 * scale, centerX + 60 * scale, lungBaseY + 15 * scale)
    ctx.stroke()

    ctx.lineWidth = 2
    // Upper branch
    ctx.beginPath()
    ctx.moveTo(centerX + 45 * scale, lungBaseY)
    ctx.quadraticCurveTo(centerX + 55 * scale, lungBaseY - 15 * scale, centerX + 70 * scale, lungBaseY - 20 * scale)
    ctx.stroke()
    // Middle branch
    ctx.beginPath()
    ctx.moveTo(centerX + 50 * scale, lungBaseY + 8 * scale)
    ctx.quadraticCurveTo(centerX + 65 * scale, lungBaseY + 5 * scale, centerX + 80 * scale, lungBaseY)
    ctx.stroke()
    // Lower branch
    ctx.beginPath()
    ctx.moveTo(centerX + 55 * scale, lungBaseY + 15 * scale)
    ctx.quadraticCurveTo(centerX + 65 * scale, lungBaseY + 28 * scale, centerX + 75 * scale, lungBaseY + 38 * scale)
    ctx.stroke()

    // ===========================================
    // TAR DAMAGE VISUALIZATION
    // ===========================================
    if (tar > 15) {
      // Dark tar spots - more realistic distribution
      const spotCount = Math.floor(tar / 8)

      for (let i = 0; i < spotCount; i++) {
        const side = i % 2 === 0 ? -1 : 1
        const spotX = centerX + side * (25 + Math.random() * 55) * scale
        const spotY = lungBaseY + (-15 + Math.random() * 50) * scale
        const spotSize = (2 + Math.random() * 4) * scale

        // Tar spot with slight blur effect
        const tarGradient = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, spotSize)
        tarGradient.addColorStop(0, `rgba(20, 15, 10, ${0.6 + tarFactor * 0.4})`)
        tarGradient.addColorStop(0.7, `rgba(30, 20, 15, ${0.4 + tarFactor * 0.3})`)
        tarGradient.addColorStop(1, `rgba(40, 30, 20, 0)`)

        ctx.fillStyle = tarGradient
        ctx.beginPath()
        ctx.arc(spotX, spotY, spotSize * 1.5, 0, Math.PI * 2)
        ctx.fill()
      }

      // Darkening veins when heavily damaged
      if (tar > 50) {
        ctx.strokeStyle = `rgba(30, 20, 15, ${tarFactor * 0.5})`
        ctx.lineWidth = 1.5

        // Left damaged vessels
        ctx.beginPath()
        ctx.moveTo(centerX - 50 * scale, lungBaseY + 5 * scale)
        ctx.quadraticCurveTo(centerX - 60 * scale, lungBaseY + 20 * scale, centerX - 55 * scale, lungBaseY + 35 * scale)
        ctx.stroke()

        // Right damaged vessels
        ctx.beginPath()
        ctx.moveTo(centerX + 50 * scale, lungBaseY + 5 * scale)
        ctx.quadraticCurveTo(centerX + 60 * scale, lungBaseY + 20 * scale, centerX + 55 * scale, lungBaseY + 35 * scale)
        ctx.stroke()
      }
    }

    // ===========================================
    // BREATHING ANIMATION GLOW (when healthy)
    // ===========================================
    if (health > 60 && tar < 40) {
      const breathPhase = (Date.now() % 3000) / 3000
      const glowIntensity = Math.sin(breathPhase * Math.PI * 2) * 0.1 + 0.1

      ctx.fillStyle = `rgba(255, 200, 200, ${glowIntensity * healthFactor})`
      ctx.beginPath()
      ctx.ellipse(centerX - 55 * scale, lungBaseY + 10 * scale, 25 * scale, 30 * scale, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(centerX + 55 * scale, lungBaseY + 10 * scale, 25 * scale, 30 * scale, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }, [])

  // ===========================================
  // GAME LOOP
  // ===========================================
  const gameLoop = useCallback(
    (timestamp: number) => {
      if (!canvasRef.current) return

      const ctx = canvasRef.current.getContext("2d")
      if (!ctx) return

      // Delta time calculation
      const deltaTime = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1)
      lastTimeRef.current = timestamp
      gameTimeRef.current += deltaTime

      // Update survival time
      setSurvivalTime((prev) => prev + deltaTime)

      spawnTimerRef.current += deltaTime * 1000
      const spawnRate = getSpawnRate(levelRef.current)

      if (spawnTimerRef.current >= spawnRate) {
        spawnObject()
        // Spawn extra objects at higher levels for intensity
        if (levelRef.current >= 5 && Math.random() < 0.3) {
          setTimeout(() => spawnObject(), 100)
        }
        if (levelRef.current >= 8 && Math.random() < 0.2) {
          setTimeout(() => spawnObject(), 200)
        }
        spawnTimerRef.current = 0
      }

      // Level timer
      levelTimerRef.current += deltaTime * 1000
      if (levelTimerRef.current >= LEVEL_DURATION && levelRef.current < 10) {
        levelTimerRef.current = 0
        levelRef.current += 1
        setLevel(levelRef.current)
        setCurrentFact(FACTS[language as "id" | "en"][levelRef.current - 1] || "")
        setGameState("levelup")
        playSound("levelup")
        setTimeout(() => setGameState("playing"), 3000)
      }

      // Smooth shield movement with easing
      const shieldDiff = targetShieldXRef.current - shieldXRef.current
      shieldXRef.current += shieldDiff * 0.18

      // Update screen shake
      if (screenShake > 0) {
        setScreenShake((prev) => Math.max(0, prev - deltaTime * 12))
      }

      // ===========================================
      // UPDATE PARTICLES
      // ===========================================
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx * deltaTime
        p.y += p.vy * deltaTime
        p.vy += 250 * deltaTime // Gravity
        p.life -= deltaTime / p.maxLife
        return p.life > 0
      })

      floatingTextsRef.current = floatingTextsRef.current.filter((ft) => {
        ft.y -= 60 * deltaTime
        ft.life -= deltaTime * 1.5
        return ft.life > 0
      })

      // ===========================================
      // UPDATE OBJECTS & COLLISION DETECTION
      // ===========================================
      const shieldLeft = shieldXRef.current - SHIELD_WIDTH / 2
      const shieldRight = shieldXRef.current + SHIELD_WIDTH / 2

      let damageThisFrame = 0
      let scoreThisFrame = 0
      let tarThisFrame = 0

      objectsRef.current = objectsRef.current.filter((obj) => {
        obj.y += obj.speed * deltaTime

        if (obj.type === "smoke-zigzag" && obj.zigzagPhase !== undefined) {
          obj.zigzagPhase += deltaTime * (obj.zigzagFrequency || 3)
          obj.x += Math.sin(obj.zigzagPhase) * (obj.zigzagAmplitude || 40) * deltaTime * 3
          // Keep in bounds
          obj.x = Math.max(obj.size / 2, Math.min(GAME_WIDTH - obj.size / 2, obj.x))
        }

        // Shield collision zone
        const objBottom = obj.y + obj.size / 2
        const objTop = obj.y - obj.size / 2
        const objLeft = obj.x - obj.size / 2
        const objRight = obj.x + obj.size / 2

        // Check shield collision
        if (objBottom >= SHIELD_Y && objTop <= SHIELD_Y + SHIELD_HEIGHT) {
          if (objRight >= shieldLeft && objLeft <= shieldRight) {
            // Collision with shield!
            const isHarmful = obj.type.startsWith("smoke") || obj.type === "tar" || obj.type === "cigarette"

            if (isHarmful) {
              let points = 15
              if (obj.type === "cigarette") points = 50
              else if (obj.type === "tar") points = 30
              else if (obj.type === "smoke-fast") points = 25
              else if (obj.type === "smoke-big") points = 35
              else if (obj.type === "smoke-zigzag") points = 30

              const finalPoints = Math.floor(points * (1 + comboRef.current * 0.2))
              scoreThisFrame += finalPoints
              comboRef.current = Math.min(comboRef.current + 1, 10)
              setCombo(comboRef.current)
              setMaxCombo((prev) => Math.max(prev, comboRef.current))
              setStats((prev) => ({ ...prev, smokeBlocked: prev.smokeBlocked + 1 }))
              createParticles(obj.x, obj.y, "smoke")
              createFloatingText(obj.x, obj.y - 20, `+${finalPoints}`, "#22c55e")
              playSound("block")
            } else if (obj.type === "fresh-air") {
              healthRef.current = Math.min(100, healthRef.current + 10)
              setHealth(healthRef.current)
              scoreThisFrame += 25
              setStats((prev) => ({ ...prev, powerupsCollected: prev.powerupsCollected + 1 }))
              createParticles(obj.x, obj.y, "air")
              createFloatingText(obj.x, obj.y - 20, "+10 HP", "#06b6d4")
              playSound("powerup")
            } else if (obj.type === "medicine") {
              healthRef.current = Math.min(100, healthRef.current + 25)
              tarRef.current = Math.max(0, tarRef.current - 20)
              setHealth(healthRef.current)
              setTarMeter(tarRef.current)
              scoreThisFrame += 40
              setStats((prev) => ({ ...prev, powerupsCollected: prev.powerupsCollected + 1 }))
              createParticles(obj.x, obj.y, "heal")
              createFloatingText(obj.x, obj.y - 20, "+25 HP -20 Tar", "#22c55e")
              playSound("powerup")
            }
            return false
          }
        }

        // Check if passed lungs
        if (obj.y > LUNG_Y + 30) {
          const isHarmful = obj.type.startsWith("smoke") || obj.type === "tar" || obj.type === "cigarette"

          if (isHarmful) {
            let damage = 10
            let tarDmg = 4
            if (obj.type === "cigarette") {
              damage = 30
              tarDmg = 15
            } else if (obj.type === "tar") {
              damage = 20
              tarDmg = 10
            } else if (obj.type === "smoke-big") {
              damage = 18
              tarDmg = 8
            } else if (obj.type === "smoke-fast") {
              damage = 12
              tarDmg = 5
            } else if (obj.type === "smoke-zigzag") {
              damage = 14
              tarDmg = 6
            }

            damageThisFrame += damage
            tarThisFrame += tarDmg
            comboRef.current = 0
            setCombo(0)
            createParticles(obj.x, LUNG_Y, "damage")
            createFloatingText(obj.x, LUNG_Y - 20, `-${damage}`, "#ef4444")
          }
          return false
        }

        return true
      })

      // Apply damage
      if (damageThisFrame > 0) {
        healthRef.current = Math.max(0, healthRef.current - damageThisFrame)
        tarRef.current = Math.min(100, tarRef.current + tarThisFrame)
        setHealth(healthRef.current)
        setTarMeter(tarRef.current)
        setStats((prev) => ({
          ...prev,
          totalDamage: prev.totalDamage + damageThisFrame,
          tarAbsorbed: prev.tarAbsorbed + tarThisFrame,
        }))
        setShowDamageFlash(true)
        setScreenShake(6)
        playSound("damage")
        setTimeout(() => setShowDamageFlash(false), 150)

        // Check game over
        if (healthRef.current <= 0 || tarRef.current >= 100) {
          setGameState("gameover")
          playSound("gameover")
          return
        }
      }

      // Apply score
      if (scoreThisFrame > 0) {
        scoreRef.current += Math.floor(scoreThisFrame)
        setScore(scoreRef.current)
      }

      // ===========================================
      // RENDER
      // ===========================================
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

      const pollutionLevel = tarRef.current / 100
      const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT)

      // Top: dark polluted sky (gets darker with more tar)
      gradient.addColorStop(
        0,
        `rgb(${60 + pollutionLevel * 30}, ${60 + pollutionLevel * 20}, ${70 + pollutionLevel * 20})`,
      )
      gradient.addColorStop(
        0.15,
        `rgb(${80 + pollutionLevel * 40}, ${80 + pollutionLevel * 30}, ${90 + pollutionLevel * 30})`,
      )
      // Middle transition
      gradient.addColorStop(
        0.4,
        `rgb(${120 - pollutionLevel * 40}, ${150 - pollutionLevel * 60}, ${180 - pollutionLevel * 80})`,
      )
      // Bottom: clean blue (fades with tar)
      gradient.addColorStop(
        0.7,
        `rgb(${160 - pollutionLevel * 60}, ${200 - pollutionLevel * 80}, ${230 - pollutionLevel * 100})`,
      )
      gradient.addColorStop(
        1,
        `rgb(${200 - pollutionLevel * 80}, ${220 - pollutionLevel * 90}, ${240 - pollutionLevel * 100})`,
      )

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

      ctx.fillStyle = `rgba(100, 100, 100, ${0.1 + pollutionLevel * 0.2})`
      for (let i = 0; i < 15; i++) {
        const x = ((gameTimeRef.current * 20 + i * 50) % (GAME_WIDTH + 100)) - 50
        const y = 30 + Math.sin(gameTimeRef.current + i) * 20 + i * 15
        ctx.beginPath()
        ctx.arc(x, y, 15 + Math.sin(gameTimeRef.current * 2 + i) * 5, 0, Math.PI * 2)
        ctx.fill()
      }

      if (tarRef.current > 30) {
        ctx.fillStyle = `rgba(20, 15, 10, ${(tarRef.current - 30) / 200})`
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
      }

      drawRealisticLungs(ctx, healthRef.current, tarRef.current)

      // Draw shield with enhanced glow effect
      const shieldGradient = ctx.createLinearGradient(
        shieldXRef.current - SHIELD_WIDTH / 2,
        SHIELD_Y,
        shieldXRef.current + SHIELD_WIDTH / 2,
        SHIELD_Y + SHIELD_HEIGHT,
      )
      shieldGradient.addColorStop(0, "#3b82f6")
      shieldGradient.addColorStop(0.5, "#60a5fa")
      shieldGradient.addColorStop(1, "#3b82f6")

      // Shield glow (stronger)
      ctx.shadowColor = "#3b82f6"
      ctx.shadowBlur = 20
      ctx.fillStyle = shieldGradient
      ctx.beginPath()
      ctx.roundRect(shieldXRef.current - SHIELD_WIDTH / 2, SHIELD_Y, SHIELD_WIDTH, SHIELD_HEIGHT, 7)
      ctx.fill()

      // Shield border
      ctx.strokeStyle = "#93c5fd"
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.shadowBlur = 0

      // Draw falling objects
      for (const obj of objectsRef.current) {
        ctx.save()
        ctx.globalAlpha = obj.opacity

        const colors: Record<string, { bg: string; border: string; icon: string }> = {
          smoke: { bg: "#6b7280", border: "#9ca3af", icon: "💨" },
          "smoke-fast": { bg: "#ef4444", border: "#fca5a5", icon: "💨" },
          "smoke-big": { bg: "#4b5563", border: "#6b7280", icon: "💨" },
          "smoke-zigzag": { bg: "#8b5cf6", border: "#a78bfa", icon: "💨" },
          tar: { bg: "#1f2937", border: "#374151", icon: "🖤" },
          cigarette: { bg: "#ea580c", border: "#fb923c", icon: "🚬" },
          "fresh-air": { bg: "#06b6d4", border: "#22d3ee", icon: "🌬️" },
          medicine: { bg: "#22c55e", border: "#4ade80", icon: "💊" },
        }

        const { bg, border, icon } = colors[obj.type] || colors.smoke

        // Object glow for power-ups
        if (obj.type === "fresh-air" || obj.type === "medicine") {
          ctx.shadowColor = bg
          ctx.shadowBlur = 15
        }

        // Draw object circle
        ctx.fillStyle = bg
        ctx.beginPath()
        ctx.arc(obj.x, obj.y, obj.size / 2, 0, Math.PI * 2)
        ctx.fill()

        // Border
        ctx.strokeStyle = border
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.shadowBlur = 0

        // Draw icon
        ctx.font = `${obj.size * 0.55}px Arial`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(icon, obj.x, obj.y)

        if (obj.type === "smoke-fast") {
          ctx.fillStyle = "#fca5a5"
          ctx.font = "bold 10px Arial"
          ctx.fillText("⚡", obj.x + obj.size / 2 - 5, obj.y - obj.size / 2 + 5)
        }

        ctx.restore()
      }

      // Draw particles
      for (const p of particlesRef.current) {
        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      ctx.textAlign = "center"
      for (const ft of floatingTextsRef.current) {
        ctx.globalAlpha = ft.life
        ctx.fillStyle = ft.color
        ctx.font = "bold 18px Arial"
        ctx.fillText(ft.text, ft.x, ft.y)
      }
      ctx.globalAlpha = 1

      // Continue loop
      animationRef.current = requestAnimationFrame(gameLoop)
    },
    [language, playSound, spawnObject, createParticles, createFloatingText, drawRealisticLungs, screenShake],
  )

  // ===========================================
  // GAME CONTROLS
  // ===========================================
  useEffect(() => {
    if (gameState !== "playing") return

    lastTimeRef.current = performance.now()
    animationRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameState, gameLoop])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return

      const moveSpeed = 30
      if (e.key === "ArrowLeft" || e.key === "a") {
        targetShieldXRef.current = Math.max(SHIELD_WIDTH / 2, targetShieldXRef.current - moveSpeed)
      } else if (e.key === "ArrowRight" || e.key === "d") {
        targetShieldXRef.current = Math.min(GAME_WIDTH - SHIELD_WIDTH / 2, targetShieldXRef.current + moveSpeed)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameState])

  // Touch/Mouse controls
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (gameState !== "playing" || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * GAME_WIDTH
      targetShieldXRef.current = Math.max(SHIELD_WIDTH / 2, Math.min(GAME_WIDTH - SHIELD_WIDTH / 2, x))
    },
    [gameState],
  )

  // Responsive canvas scaling
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        setScale(Math.min(1, containerWidth / GAME_WIDTH))
      }
    }

    updateScale()
    window.addEventListener("resize", updateScale)
    return () => window.removeEventListener("resize", updateScale)
  }, [])

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem("werok-highscore-v3")
    if (saved) setHighScore(Number.parseInt(saved))
  }, [])

  // Save high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem("werok-highscore-v3", score.toString())
    }
  }, [score, highScore])

  // ===========================================
  // GAME FUNCTIONS
  // ===========================================
  const startGame = (mode: GameMode = "endless") => {
    setGameMode(mode)
    setGameState("playing")
    setScore(0)
    setHealth(100)
    setTarMeter(0)
    setCombo(0)
    setMaxCombo(0)
    setLevel(1)
    setSurvivalTime(0)
    setCurrentFact("")
    setStats({ smokeBlocked: 0, tarAbsorbed: 0, totalDamage: 0, powerupsCollected: 0 })

    objectsRef.current = []
    particlesRef.current = []
    floatingTextsRef.current = []
    shieldXRef.current = GAME_WIDTH / 2
    targetShieldXRef.current = GAME_WIDTH / 2
    healthRef.current = 100
    tarRef.current = 0
    scoreRef.current = 0
    comboRef.current = 0
    levelRef.current = 1
    spawnTimerRef.current = 0
    levelTimerRef.current = 0
    gameTimeRef.current = 0
  }

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTarBarColor = (tar: number) => {
    if (tar < 30) return "bg-yellow-400"
    if (tar < 60) return "bg-orange-500"
    return "bg-red-600"
  }

  // ===========================================
  // RENDER
  // ===========================================
  return (
    <section id="minigame" className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-red-500 font-semibold uppercase tracking-wider text-sm">MINIGAME</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-slate-900 dark:text-white">Lung Defender</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3 max-w-2xl mx-auto">
            {language === "id"
              ? "Lindungi paru-parumu dari asap rokok yang jatuh! Gerakkan shield dengan mouse/touch atau tombol panah."
              : "Protect your lungs from falling cigarette smoke! Move the shield with mouse/touch or arrow keys."}
          </p>
        </div>

        <div className="max-w-2xl mx-auto" ref={containerRef}>
          {/* HUD */}
          <div className="bg-slate-800 rounded-t-2xl p-3 flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-4">
              {/* HP Bar */}
              <div className="flex items-center gap-2">
                <Heart className={`w-5 h-5 ${health > 30 ? "text-red-500" : "text-red-500 animate-pulse"}`} />
                <div className="w-20 md:w-28 h-3 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${health > 60 ? "bg-green-500" : health > 30 ? "bg-yellow-500" : "bg-red-500"}`}
                    animate={{ width: `${health}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <AlertTriangle
                  className={`w-5 h-5 ${tarMeter > 60 ? "text-red-500 animate-pulse" : tarMeter > 30 ? "text-orange-500" : "text-yellow-500"}`}
                />
                <div className="w-16 md:w-24 h-3 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${getTarBarColor(tarMeter)}`}
                    animate={{ width: `${tarMeter}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <span className="text-xs text-slate-400 hidden md:inline">TAR</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-slate-400 text-xs bg-slate-700/50 px-2 py-1 rounded">
                <Clock className="w-3 h-3" />
                {formatTime(survivalTime)}
              </div>

              {/* Level */}
              <div className="text-white font-bold text-sm bg-slate-700 px-2 py-1 rounded">Lv.{level}</div>

              {/* Combo */}
              {combo > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 text-yellow-400 font-bold text-sm bg-slate-700 px-2 py-1 rounded"
                >
                  <Zap className="w-4 h-4" />x{combo}
                </motion.div>
              )}

              {/* Score */}
              <motion.div
                className="text-white font-bold text-lg bg-slate-700 px-3 py-1 rounded min-w-[80px] text-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.2 }}
                key={score}
              >
                {score.toLocaleString()}
              </motion.div>

              {/* Sound */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-white/70 hover:text-white transition-colors"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Game Canvas Container */}
          <div
            className="relative bg-slate-200 dark:bg-slate-800 overflow-hidden border-x-4 border-slate-600"
            style={{
              height: GAME_HEIGHT * scale,
              transform:
                screenShake > 0
                  ? `translate(${(Math.random() - 0.5) * screenShake}px, ${(Math.random() - 0.5) * screenShake}px)`
                  : undefined,
            }}
            onPointerMove={handlePointerMove}
          >
            {/* Canvas */}
            <canvas
              ref={canvasRef}
              width={GAME_WIDTH}
              height={GAME_HEIGHT}
              style={{
                width: "100%",
                height: "100%",
              }}
            />

            {/* Damage Flash Overlay */}
            <AnimatePresence>
              {showDamageFlash && (
                <motion.div
                  initial={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-red-500/40 pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* Idle Screen */}
            <AnimatePresence>
              {gameState === "idle" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm"
                >
                  <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} className="text-center p-6">
                    <div className="text-6xl mb-4">🫁</div>
                    <h3 className="text-2xl font-bold text-white mb-2">Lung Defender</h3>
                    <p className="text-slate-300 text-sm mb-6 max-w-xs mx-auto">
                      {language === "id"
                        ? "Lindungi paru-paru dari racun rokok yang jatuh!"
                        : "Protect the lungs from falling cigarette toxins!"}
                    </p>

                    <div className="bg-slate-800/80 rounded-lg p-4 mb-6 text-left text-sm">
                      <div className="grid grid-cols-2 gap-2 text-white text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-gray-500 flex items-center justify-center text-sm">
                            💨
                          </span>
                          <span className="text-slate-300">Normal</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-sm">
                            💨
                          </span>
                          <span className="text-red-400">Fast!</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm">
                            💨
                          </span>
                          <span className="text-slate-300">Big</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-sm">
                            💨
                          </span>
                          <span className="text-purple-400">Zigzag</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-sm">
                            🖤
                          </span>
                          <span className="text-yellow-400">+Tar</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-orange-600 flex items-center justify-center text-sm">
                            🚬
                          </span>
                          <span className="text-red-400">Danger!</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-cyan-500 flex items-center justify-center text-sm">
                            🌬️
                          </span>
                          <span className="text-green-400">+HP</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-sm">
                            💊
                          </span>
                          <span className="text-green-400">Heal+</span>
                        </div>
                      </div>
                      <p className="text-slate-400 mt-3 text-xs text-center flex items-center justify-center gap-1">
                        <Info className="w-3 h-3" />
                        {language === "id"
                          ? "HP habis atau Tar penuh = Game Over!"
                          : "Empty HP or Full Tar = Game Over!"}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Button
                        onClick={() => startGame("endless")}
                        size="lg"
                        className="bg-green-600 hover:bg-green-700 w-full"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        {language === "id" ? "Mode Endless" : "Endless Mode"}
                      </Button>
                      <Button
                        onClick={() => startGame("survival")}
                        size="lg"
                        variant="outline"
                        className="w-full border-cyan-500 text-cyan-400 hover:bg-cyan-500/20"
                      >
                        <Shield className="w-5 h-5 mr-2" />
                        {language === "id" ? "Bertahan 2 Menit" : "Survive 2 Minutes"}
                      </Button>
                    </div>

                    {highScore > 0 && (
                      <p className="text-yellow-400 mt-4 flex items-center justify-center gap-2">
                        <Trophy className="w-4 h-4" />
                        High Score: {highScore.toLocaleString()}
                      </p>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Level Up Screen */}
            <AnimatePresence>
              {gameState === "levelup" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
                >
                  <motion.div initial={{ scale: 0.5, y: 50 }} animate={{ scale: 1, y: 0 }} className="text-center p-6">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, repeat: 2 }}
                      className="text-5xl mb-4"
                    >
                      ⬆️
                    </motion.div>
                    <h3 className="text-3xl font-bold text-yellow-400 mb-2">Level {level}!</h3>
                    <p className="text-slate-400 text-sm mb-2">
                      {language === "id" ? "Kecepatan meningkat!" : "Speed increased!"}
                    </p>

                    {currentFact && (
                      <div className="bg-slate-800/90 rounded-lg p-4 mt-4 max-w-sm">
                        <p className="text-slate-300 text-sm leading-relaxed">💡 {currentFact}</p>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Game Over Screen */}
            <AnimatePresence>
              {gameState === "gameover" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm overflow-y-auto py-4"
                >
                  <motion.div
                    initial={{ scale: 0.8, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="text-center p-4 max-w-sm"
                  >
                    <Skull className="w-16 h-16 text-red-500 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {tarMeter >= 100
                        ? language === "id"
                          ? "Paru-paru Penuh Tar!"
                          : "Lungs Full of Tar!"
                        : language === "id"
                          ? "Paru-paru Rusak!"
                          : "Lungs Destroyed!"}
                    </h3>

                    {/* Stats */}
                    <div className="bg-slate-800/80 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-2 gap-3 text-white text-sm">
                        <div>
                          <p className="text-slate-400 text-xs">{language === "id" ? "Skor Akhir" : "Final Score"}</p>
                          <p className="text-xl font-bold text-yellow-400">{score.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">
                            {language === "id" ? "Waktu Bertahan" : "Survival Time"}
                          </p>
                          <p className="text-xl font-bold text-cyan-400">{formatTime(survivalTime)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">
                            {language === "id" ? "Racun Diblokir" : "Toxins Blocked"}
                          </p>
                          <p className="text-lg font-bold text-green-400">{stats.smokeBlocked}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">
                            {language === "id" ? "Combo Tertinggi" : "Max Combo"}
                          </p>
                          <p className="text-lg font-bold text-orange-400">x{maxCombo}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">
                            {language === "id" ? "Level Tercapai" : "Level Reached"}
                          </p>
                          <p className="text-lg font-bold text-blue-400">{level}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">{language === "id" ? "Power-up" : "Power-ups"}</p>
                          <p className="text-lg font-bold text-emerald-400">{stats.powerupsCollected}</p>
                        </div>
                      </div>

                      {score >= highScore && score > 0 && (
                        <motion.p
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-yellow-400 mt-3 flex items-center justify-center gap-2 font-bold"
                        >
                          <Trophy className="w-5 h-5" />
                          {language === "id" ? "Skor Tertinggi Baru!" : "New High Score!"}
                        </motion.p>
                      )}
                    </div>

                    <Button
                      onClick={() => startGame(gameMode)}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 w-full"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      {language === "id" ? "Main Lagi" : "Play Again"}
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Bar */}
          <div className="bg-slate-800 rounded-b-2xl p-3 flex justify-between items-center text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <span>🎮</span>
              <span>{language === "id" ? "Gunakan mouse/touch atau ← →" : "Use mouse/touch or ← →"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span>{highScore.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
