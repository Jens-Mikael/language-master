"use client";

import { useAuth } from "@/firebase/context/AuthContext";

export default function Home() {
  const { logout } = useAuth();
  return (
    <div className="min-h-full flex items-center justify-center font-croissantOne p-4">
      <div
        onClick={logout}
        className="w-full max-w-5xl dark:bg-white/10 rounded-3xl p-14 text-6xl"
      >
        Language Mastery
      </div>
    </div>
  );
}
