import { HiOutlineHome } from "react-icons/hi2";
import { CgProfile } from "react-icons/cg";
import { GoSignIn } from "react-icons/go";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/Shadcn/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Shadcn/dropdown-menu";
import { Button } from "@/components/Shadcn/button";

function getDashboard(role?: string) {
  if (role === "admin") return "/admin";
  if (role === "recruiter") return "/recruiter";
  return "/candidate";
}

const commonDropCls =
  "w-full flex items-center gap-2.5 px-4 py-1 text-sm text-primary-gray hover:bg-indigoTags/5 hover:text-dark-text transition-colors";

export default function UserProfile() {
  const { data: session } = useSession();
  const user = session?.user;
  const dashboard = getDashboard(user?.role);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full flex items-center gap-2.5 group focus:outline-none cursor-pointer"
          >
            <Avatar className="w-9 h-9 ring-2 ring-indigoTags/30 group-hover:ring-indigoTags transition-all">
              <AvatarImage src={user?.avatar || ""} alt={user?.name || ""} />
              <AvatarFallback className="bg-indigoTags text-white text-sm font-semibold">
                {user?.name}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start leading-tight">
              <span className="text-sm font-semibold text-dark-text">
                {user?.name?.split(" ")[0]}
              </span>
              <span className="text-[11px] text-indigoTags capitalize font-medium">
                {user?.role}
              </span>
            </div>
          </Button>
        }
      />
      <DropdownMenuContent className="w-48 bg-slate-100">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <div className="py-1">
              <p className="text-sm font-semibold text-dark-text truncate">
                {user?.name}
              </p>
              <p className="text-xs text-primary-gray truncate">
                {user?.email}
              </p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={dashboard} className={commonDropCls}>
              <HiOutlineHome className="w-4 h-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={`${dashboard}/profile`} className={commonDropCls}>
              <CgProfile className="w-4 h-4" />
              Profile
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="border-t-2 border-dashed border-primary-gray/20">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => signOut({ callbackUrl: "/" })}
            className={`${commonDropCls} text-red-500 hover:bg-red-50 cursor-pointer py-1.5`}
          >
            <GoSignIn className="w-4 h-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
