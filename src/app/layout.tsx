import type { Metadata } from "next";
import { Lato, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/layout/AppShell";

// Lato — body / UI sans across the app.
const lato = Lato({
  variable: "--font-sans-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700", "900"],
});

// Lora — reserved for *big* headings (page titles only). Everything smaller
// stays in Lato to keep the UI calm and legible.
const lora = Lora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Drishti — India Defence Futures",
  description:
    "Model India's defence requirements from 2026 to 2047. Build your own procurement projection, compute the budget impact, and share it publicly.",
  openGraph: {
    title: "Drishti — India Defence Futures",
    description: "Interactive defence procurement modelling for India 2026–2047",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lato.variable} ${lora.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="h-full bg-background text-foreground font-sans">
        <TooltipProvider>
          <AppShell>{children}</AppShell>
        </TooltipProvider>
      </body>
    </html>
  );
}
