import { redirect } from "next/navigation";
import "../../globals.css";
import Sidebar from "@/components/admin/Sidebar/Sidebar";
import TopHeader from "@/components/admin/TopHeader/TopHeader";

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
    <html>
      <body className="">
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
