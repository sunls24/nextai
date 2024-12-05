import "./globals.css";
import type { Metadata, Viewport } from "next";
import React from "react";
import { Toaster } from "@/components/ui/sonner";
import Umami from "@/components/umami";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: {
    default: "NEXT AI",
    template: "%s - NEXT AI",
  },
  description:
    "一个简单而优雅的 AI 聊天程序，支持 Google 搜索工具调用, GPT-3.5-Turbo, GPT4, Tools, Image input",
  appleWebApp: {
    title: "NEXT AI",
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff" },
    { media: "(prefers-color-scheme: dark)", color: "#18181b" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json"></link>
      </head>
      <body>
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
        <Umami />
      </body>
    </html>
  );
}
