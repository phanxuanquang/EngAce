"use client"

import { createContext, useContext, useEffect, useState } from "react"

type ThemeProviderProps = {
  children: React.ReactNode
}

type ThemeContextType = {
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem("theme")
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (storedTheme === "dark" || (!storedTheme && systemPrefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        setIsDark(e.matches)
        document.documentElement.classList.toggle("dark", e.matches)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
    localStorage.setItem("theme", !isDark ? "dark" : "light")
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}