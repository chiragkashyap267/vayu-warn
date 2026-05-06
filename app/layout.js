// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "VayuWarn — Real-Time Disaster Alert System",
  description:
    "Community-powered disaster early warning system. Real-time alerts, crowd-sourced reports, and emergency resources for climate resilience in India.",
  keywords: ["disaster alert", "flood warning", "landslide", "emergency", "India", "real-time"],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
