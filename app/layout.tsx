import type { Metadata } from "next";
import { Nunito, Dancing_Script } from 'next/font/google'
import "./globals.css";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import NavigationObserver from "./components/NavigationObserver";
import CartButton from "./components/CartButton";
import ReservationPanel from "./components/ReservationPanel";


const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
})

const dancing = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-dancing',
})

export const metadata: Metadata = {
  title: "Cofee",
  description: "get ur favorit cofee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${dancing.variable} h-full antialiased`}
    >
      <body className="bg-[#0E0D0B]">
        <CustomCursor />
        <Navbar />
        <NavigationObserver />
        <CartButton />
        <ReservationPanel />
        {children}
      </body>
    </html>
  );
}
