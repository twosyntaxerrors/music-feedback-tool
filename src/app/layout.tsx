import type { Metadata } from "next";
import { Inter, Righteous } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });
const righteous = Righteous({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-righteous",
});

export const metadata: Metadata = {
  title: "Audio Analysis with Gemini AI",
  description: "Get detailed analysis of your audio files using Gemini AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} ${righteous.variable} bg-background text-foreground`}>
        {children}
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
