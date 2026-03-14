import { Epilogue, Roboto, Roboto_Mono, Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "QuickHire",
  description: "Job board for candidates",
  icons: {
    icon: "/images/fac-ico.png",
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

           antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
