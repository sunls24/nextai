import "./globals.css";
import type { Metadata, Viewport } from "next";
import React from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: "NEXT AI",
    template: "%s - NEXT AI",
  },
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
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster
          toastOptions={{
            className: "!bg-background !text-foreground dark:border !max-w-2xl",
          }}
        />
      </body>
    </html>
  );
}
