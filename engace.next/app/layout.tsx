import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/contexts/ThemeContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EngAce - Học tiếng Anh theo cách của bạn",
  description: "Nền tảng miễn phí sử dụng AI để nâng tầm trải nghiệm học tiếng Anh dành riêng cho người Việt",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-150">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
