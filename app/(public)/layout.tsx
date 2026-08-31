import Footer from "@/components/UI-Sections/Footer/Footer";
import Header from "@/components/UI-Sections/Header/Header";
import { Toaster } from "react-hot-toast";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Toaster position="top-center" />
      <Footer />
    </>
  );
}
