import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-sans" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Храм Иоанна Богослова — Святой источник | Волгоград",
  description:
    "Церковь святого апостола и евангелиста Иоанна Богослова при живоносном источнике в пойме реки Царицы. Расписание богослужений, история храма, новости прихода.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${inter.variable} ${cormorant.variable} antialiased bg-[#FCFAF7]`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}