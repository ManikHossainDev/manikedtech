import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ProviderContent from "@/redux/ProviderContent";
import { Toaster } from "sonner";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EdTechPlatform",
  description:
    "EdTechPlatform is a next-generation education platform designed to empower students and educators with digital learning tools, courses, and interactive resources.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProviderContent>
          <Toaster position="top-right" />
          {children}
        </ProviderContent>
      </body>
    </html>
  );
}
