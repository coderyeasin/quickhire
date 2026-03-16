import { Epilogue, Roboto, Roboto_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
import "../../globals.css";
import Sidebar from "@/components/admin/Sidebar/Sidebar";
import TopHeader from "@/components/admin/TopHeader/TopHeader";
import type { Metadata } from "next";

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
      path: "../../../public/fonts/ClashDisplay/ClashDisplay-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../public/fonts/ClashDisplay/ClashDisplay-Medium.otf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-clash",
});
const sfPro = localFont({
  src: [
    {
      path: "../../../public/fonts/sf-pro-display/sf-pro-bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../public/fonts/sf-pro-display/sf-pro-medium.otf",
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

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await auth();

  // if (!session) {
  //   redirect("/api/auth/signin");
  // }

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
        <div className="flex min-h-screen bg-[#F8F8FD]">
          <Sidebar />
          <div className="pl-64 flex-1 flex flex-col">
            <TopHeader />
            <main className="p-10">
              <div className="container-layout mx-0 max-w-full">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
