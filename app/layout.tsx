import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import "@xyflow/react/dist/style.css";
import { ThemeProvider } from "@/components/providers/theme";
import { ReactFlowProvider } from "@xyflow/react";
import { ContextMenuProvider } from "@/components/providers/context-menu";
import { FileManagerProvider } from "@/components/providers/file-manager";
import { OverlayProvider } from "@/components/providers/overlay";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Cozy Creator Graph Editor",
  description: "Create next generation images with Cozy Creator Graph Editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ReactFlowProvider>
            <ContextMenuProvider>
              <FileManagerProvider>
                <OverlayProvider>{children}</OverlayProvider>
              </FileManagerProvider>
            </ContextMenuProvider>
          </ReactFlowProvider>
        </body>
      </ThemeProvider>
    </html>
  );
}
