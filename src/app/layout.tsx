import type { Metadata } from "next";
import { Inter, Righteous, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/lib/convex/Provider";
import { ApiQuotaProvider } from "@/lib/contexts/ApiQuotaContext";

const inter = Inter({ subsets: ["latin"] });
const righteous = Righteous({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-righteous",
});
const syne = Syne({ 
  subsets: ["latin"],
  variable: "--font-syne",
});
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Soundscope",
  description: "Get detailed analysis of your audio files using Gemini AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorText: "#ffffff",
          colorBackground: "#1a1a1a",
          colorPrimary: "#3b82f6",
          colorShimmer: "rgba(59, 130, 246, 0.3)",
        },
        elements: {
            rootBox: {
              color: "#ffffff",
            },
            headerTitle: {
              color: "#ffffff",
            },
            headerSubtitle: {
              color: "#d1d5db",
            },
            userButtonPopoverCard: {
              backgroundColor: "#111111",
              color: "#ffffff",
              borderColor: "#2a2a2a",
            },
            userButtonPopoverActionButton: {
              color: "#ffffff",
            },
            userButtonPopoverActionButtonText: {
              color: "#ffffff",
            },
            formFieldLabel: {
              color: "#ffffff",
            },
            formButtonPrimary: {
              color: "#ffffff",
            },
          socialButtons: {
            backgroundColor: "#2a2a2a",
            borderColor: "#404040",
            color: "#ffffff",
            hoverBackgroundColor: "#3a3a3a",
            hoverBorderColor: "#505050",
          },
          socialButtonsIconButton: {
            backgroundColor: "#2a2a2a",
            borderColor: "#404040",
            color: "#ffffff",
            hoverBackgroundColor: "#3a3a3a",
            hoverBorderColor: "#505050",
          },
          socialButtonsBlockButton: {
            backgroundColor: "#2a2a2a",
            borderColor: "#404040",
            color: "#ffffff",
            hoverBackgroundColor: "#3a3a3a",
            hoverBorderColor: "#505050",
          },
            footer: {
              color: "#9ca3af",
            },
        },
      }}
    >
      <html lang="en" className="dark">
        <body className={`${inter.className} ${righteous.variable} ${syne.variable} ${jetbrainsMono.variable} bg-background text-foreground`}>
          <ConvexClientProvider>
            <ApiQuotaProvider>
              {children}
            </ApiQuotaProvider>
          </ConvexClientProvider>
          <Toaster theme="dark" />
        </body>
      </html>
    </ClerkProvider>
  );
}
