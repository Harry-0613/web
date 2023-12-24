"use client";

import { LuUser, LuLogOut } from "react-icons/lu";

import { useSession } from "next-auth/react";
import Link from "next/link";
import PlanListBar from "./PlanListBar";

export default function Header() {
  const { data: session } = useSession();
  return (
    // aside is a semantic html tag for side content
    <aside className="flex h-screen flex-col justify-between px-6 py-6">
      <div className="flex flex-col gap-2">
        <span className="border border-solid border-black p-4 rounded-lg flex justify-center items-center">
          <span className="text-4xl font-bold">🚌 Traveler</span>
        </span>
        <PlanListBar/>
        <div className="fixed left-0 bottom-0 p-4">
          <div className="flex flex-row">
            <LuUser size={20} strokeWidth={3} className="m-1" />
            <span className="m-1 text-medium font-semibold">{session?.user?.username}</span>
          </div>
          <div className="gap-4 rounded-full transition-colors duration-300 group-hover:bg-gray-200">
            <Link href={`/auth/signout`}>
              <div className="flex flex-row">
                <LuLogOut size={20} strokeWidth={3} className="m-1" />
                <span className="m-1 text-medium font-semibold">Log Out</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
