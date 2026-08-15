import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "F-Zone VR",
  description: "Pilote uma nave antigravidade por circuitos neon em realidade virtual.",
  icons: { icon: "https://lochesystem.github.io/f-zone-vr/favicon.svg", shortcut: "https://lochesystem.github.io/f-zone-vr/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
