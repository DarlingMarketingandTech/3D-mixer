"use client"

import { useEffect } from "react"
import { useScrollStore, SCROLL_SECTIONS, getCurrentSection, SECTION_COLORS } from "@/lib/scroll-store"

export function ScrollHandler() {
  useEffect(() => {
    let rafId = 0
    let targetProgress = 0
    let smoothProgress = 0
    let lastTime = performance.now()
    let running = true

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight > 0) {
        targetProgress = Math.min(Math.max(window.scrollY / scrollHeight, 0), 1)
      }
    }

    const tick = () => {
      if (!running) return
      const now = performance.now()
      const delta = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now

      const diff = targetProgress - smoothProgress

      if (Math.abs(diff) > 0.0001) {
        const MAX_SPEED_PER_SECOND = 0.85
        const maxStep = MAX_SPEED_PER_SECOND * delta

        smoothProgress += Math.sign(diff) * Math.min(Math.abs(diff), maxStep)
        useScrollStore.setState({ progress: smoothProgress })
      }

      rafId = requestAnimationFrame(tick)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      running = false
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return null
}

const BLOCK_LABELS: Record<string, string> = {
  hero: "Setup",
  tt_intro: "tt_intro", tt_angle_1: "tt_angle_1", tt_angle_2: "tt_angle_2", tt_detail: "tt_detail",
  tt_brand_focus: "Brand", tt_features: "Features",
  exploded: "Exploded", bento: "Specs",
  mx_intro: "mx_intro", mx_features: "mx_features", mx_detail: "mx_detail", mx_exploded: "mx_exploded",
  customize: "Customize", philosophy: "philosophy", showroom: "Showroom", gallery: "Gallery",
  setup_reveal: "setup_reveal", outro: "outro"
}

export function ScrollProgress() {
  const { progress } = useScrollStore()
  const currentSection = getCurrentSection(progress)

  const label = BLOCK_LABELS[currentSection] || "Scroll"
  const isLightBg = SECTION_COLORS[currentSection] === "#FFFFFF" || SECTION_COLORS[currentSection] === "#E8E8E8" || SECTION_COLORS[currentSection] === "#F2F2F2"

  return (
    <div className="fixed top-12 right-12 z-50 pointer-events-none flex flex-col items-end gap-1 mix-blend-difference">
      <span
        className="text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300"
        style={{ color: "rgba(255,255,255,0.7)" }}
      >
        {label}
      </span>

      <span
        className="text-2xl font-inter font-light transition-all duration-300"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        {Math.round(progress * 100)}%
      </span>
    </div>
  )
}
