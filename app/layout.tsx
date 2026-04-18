import { Epilogue, Roboto, Roboto_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/UI/Header/Header";
import Footer from "@/components/UI/Footer/Footer";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const epilogue = Epilogue({
  subsets: ["latin"],
  variable: "--font-epilogue",
  display: "swap",
});

export const roboto = Roboto({
  subsets: ["latin"],
  // weight: ['400', '700'],
  variable: "--font-roboto",
  display: "swap",
});

export const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

const clashDisplay = localFont({
  src: [
    {
      path: "../public/fonts/ClashDisplay/ClashDisplay-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashDisplay/ClashDisplay-Medium.otf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-clash",
});
const sfPro = localFont({
  src: [
    {
      path: "../public/fonts/sf-pro-display/sf-pro-bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/sf-pro-display/sf-pro-medium.otf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro",
});

export const metadata: Metadata = {
  title: "QuickHire",
  description: "Job board for candidates",
  icons: {
    icon: "/images/fav-ico.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
        ${inter.variable} 
        ${epilogue.variable} 
        ${roboto.variable} 
        ${robotoMono.variable} 
        ${sfPro.variable} 
        ${clashDisplay.variable} 

           antialiased`}
      >
        <Header /> {children} <Footer />
      </body>
    </html>
  );
}
