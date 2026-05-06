import Sidebar from "@/components/Admin/Sidebar/Sidebar";
import TopHeader from "@/components/Admin/TopHeader/TopHeader";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/");

  return (
    <div className="flex min-h-screen bg-[#F8F8FD]">
      <Sidebar role={session.user.role} user={session.user} />
      <div className="flex flex-col flex-1 min-w-0 lg:pl-64">
        <TopHeader user={session.user} />
        <main className="flex-1 p-6 lg:p-10">
          {/* <div className="container-layout mx-0 max-w-full">{children}</div> */}
          {children}
          <Toaster position="top-center" />
        </main>
      </div>
    </div>
  );
}
