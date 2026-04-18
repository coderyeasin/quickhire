import React from "react";

const TopHeader = ({ role }: { role: string }) => {
  console.log("User Role in TopHeader:", role); // Debugging line to check the role value
  return (
    <header className="h-20 bg-white border-b border-footer-gray flex items-center justify-between px-10 sticky top-0 z-40">
      <div className="flex flex-col">
        <h2 className="font-bold text-dark-text font-clash text-lg">
          Admin Dashboard
        </h2>
        <p className="text-xs text-primary-gray">
          Welcome back,
          {/* {session.user?.name?.split(' ')[0]} */}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-active-job/10 text-active-job text-[10px] font-bold px-2 py-1 rounded uppercase">
          System Live
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
