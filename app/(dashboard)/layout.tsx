import Sidebar from "@/components/Admin/Sidebar/Sidebar";
import TopHeader from "@/components/Admin/TopHeader/TopHeader";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/");

  return (
    <div className="flex min-h-screen bg-[#F8F8FD]">
      <Sidebar />
      <div className="pl-64 flex-1 flex flex-col">
        <TopHeader />
        <main className="p-10">
          <div className="container-layout mx-0 max-w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
