"use client";

import { useRouter } from "next/navigation";

export default function ProfileButton() {
  const router = useRouter();

  return (
    <button
      className="flex items-center gap-2 rounded-full p-3 text-start transition-colors duration-300 border border-gray-400"
      // go to home page without any query params to allow the user to change their username and handle
      // see src/components/NameDialog.tsx for more details
      onClick={() => router.push("/")}
    >
      {/* <UserAvatar />
      <div className="w-40 max-lg:hidden">
        <p className="text-sm font-bold">{username ?? "..."}</p>
        <p className="text-sm text-gray-500">{`@${handle}`}</p>
      </div>
      <MoreHorizontal size={24} className="max-lg:hidden" /> */}
      切換使用者
    </button>
  );
}
