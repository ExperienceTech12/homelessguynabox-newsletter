import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HomelessGuyNABOX Newsletter",
  description:
    "Stay updated with the latest music, playlists, and announcements from HomelessGuyNABOX — 24/7 music streaming.",
  openGraph: {
    title: "HomelessGuyNABOX Newsletter",
    description: "24/7 Music Streaming — News, Updates & Promotions",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#12121a",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#e4e4e7",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
