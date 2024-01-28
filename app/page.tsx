"use client";

import MobileTap from "@components/MobileTap";
import { useAuth } from "@context/AuthContext";
import { IUseAuth } from "../utils/declarations";

export default function Home() {
  const { logout }: IUseAuth = useAuth();
  return (
    <div className="min-h-full flex items-center justify-center font-croissantOne p-4">
      <div
        onClick={logout}
        className="w-full max-w-5xl dark:bg-white/10 rounded-3xl p-14 text-6xl"
      ></div>
      <MobileTap className="text-red-400"></MobileTap>
    </div>
  );
}
