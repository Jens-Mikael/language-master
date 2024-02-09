"use client";
import { useAuth } from "@context/AuthContext";
import { IUseAuth } from "@utils/declarations";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const { currentUser, googleAuth, isLoading }: IUseAuth = useAuth();
  const router = useRouter();
  return (
    <div className="flex-1 flex flex-col md:py-10">
      <div className="md:w-4/5 lg:w-2/3 flex flex-col gap-14">
        <div className="flex flex-col gap-8 sm:gap-10">
          <div className="text-4xl sm:text-5xl md:text-6xl">
            A Free platform for learning languages{" "}
            <span className="font-semibold italic">Anywhere, Anytime</span>.
          </div>
          <div className="text-lg sm:text-xl font-light italic">
            Welcome to Language Mastery. This is a completly free page built for
            learning languages through study sets. Here you can build your own
            sets and practice them untill you ace your exam or{" "}
            <span className="font-medium">master</span> them.
          </div>
        </div>

        <div className="text-xl sm:text-2xl font-medium">
          {!isLoading ? (
            currentUser ? (
              <>
                <Link
                  href={`/users/${currentUser.uid}/studySets`}
                  className="w-fit underline font-bold hover:text-indigo-500 transition"
                >
                  Click here
                </Link>{" "}
              </>
            ) : (
              <>
                <button
                  onClick={async () => {
                    if (!googleAuth) return;
                    const res = await googleAuth();
                    if (res) {
                      router.push("/create-set");
                    }
                  }}
                  className="w-fit underline font-bold hover:text-indigo-500 transition"
                >
                  Log in here
                </button>{" "}
              </>
            )
          ) : (
            ""
          )}

          {!isLoading
            ? currentUser
              ? "to browse your study sets"
              : "to create your first set"
            : ""}
        </div>
      </div>
    </div>
  );
}
