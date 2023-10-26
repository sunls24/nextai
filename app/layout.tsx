import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Chat AI",
  description: "Chat AI",
  viewport: {
    viewportFit: "cover",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  appleWebApp: {
    title: "Chat AI",
  },
  themeColor: "#fff ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
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
