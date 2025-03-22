import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { SWRProvider } from "@/providers/swr-provider";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam-pro"
});

export const metadata: Metadata = {
  title: "EngAce - Your AI-Powered English Learning Companion",
  description: "Learn English effectively with personalized lessons, intelligent dictionary, writing review, and AI chat assistance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${beVietnamPro.variable} font-sans antialiased bg-background text-foreground`}>
        <SWRProvider>
          {children}
        </SWRProvider>
      </body>
    </html>
  );
}
