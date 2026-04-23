"use client";
import { useSession } from "next-auth/react";
import React from "react";

const RecruiterPage = () => {
  const { data: session } = useSession();
  const user = session?.user;
  console.log("data", user);
  return (
    <div>
      <h3 className="text-3xl">RecruiterPage</h3>
    </div>
  );
};

export default RecruiterPage;
