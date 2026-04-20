import Footer from "@/components/UI-Sections/Footer/Footer";
import Header from "@/components/UI-Sections/Header/Header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
