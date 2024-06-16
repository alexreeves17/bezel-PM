import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ConvexClientProvider } from "@/components/providers/convex-provider";

import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });



export const metadata: Metadata = {
  title: "bezel PM",
  description: "The All in one workspace for PMs",
  icons: { 
    icon: [ 
      {
        media: "(prefers-color-scheme: light)",
        url: "/favicon.ico",
        href: "/favicon.ico"
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/favicon.ico",
        href: "/favicon.ico"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexClientProvider>
          <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="bezel-theme-2"
          >
            <Toaster position="bottom-center"/>
            {children}
          </ThemeProvider>
        </ConvexClientProvider>
        </body>
    </html>
  );
}
