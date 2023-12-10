import { useAuth } from "@/firebase/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SVG from "react-inlinesvg";
import LibraryDropdown from "./LibraryDropdown";
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const { googleAuth, logout, isLoading, currentUser } = useAuth();
  const pathname = usePathname();
  return (
    <div
      className={` fixed right-0 inset-0 z-20 flex lg:hidden transition ${
        sidebarOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div onClick={() => setSidebarOpen(false)} className="flex-1" />
      {/* content */}
      <div className="h-full bg-[#0A092D] w-[250px] shadow-xl flex flex-col gap-5 p-2">
        <div className="flex justify-between">
          <div className="p-2 text-lg">Menu</div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="cursor pointer p-2"
          >
            <SVG
              src="/icons/remove.svg"
              className="h-7 w-7 fill-white"
              loader={<div className="h-7 w-7" />}
            />
          </button>
        </div>

        {/* items */}
        <div className="flex flex-col">
          <Link
            href="/home"
            className="relative h-full items-center lg:flex group hidden"
          >
            Home
            <div
              className={`${
                pathname === "/home" ? "h-1" : "group-hover:h-1 h-0"
              } absolute bottom-0 w-full bg-blue-500 rounded transition-all`}
            />
          </Link>

          <div className="h-full relative lg:block hidden">
            <button
              className=" h-full items-center flex group"
              onClick={() => setIsLibraryOpen((prev) => !prev)}
            >
              <div className="flex gap-2">
                Your Library
                <SVG
                  src="/icons/arrow-down.svg"
                  className={`h-6 w-6 fill-white transition ${
                    isLibraryOpen ? "rotate-180" : "rotate-0"
                  }`}
                  loader={<div className="h-6 w-6" />}
                />
              </div>
              <div
                className={`${
                  pathname === "/library" ? "h-1" : "group-hover:h-1 h-0"
                } absolute bottom-0 w-full bg-blue-500 rounded transition-all`}
              />
            </button>
            {isLibraryOpen && (
              <>
                <LibraryDropdown setIsLibraryOpen={setIsLibraryOpen} />
                <div
                  className="z-10 fixed inset-0"
                  onClick={() => setIsLibraryOpen(false)}
                />
              </>
            )}
          </div>
          {!isLoading &&
            (currentUser ? (
              <div className="relative flex flex-col items-end gap-5">
                <Link
                  href="/create-set"
                  className="z-20 bg-blue-600 hover:bg-indigo-600 hover:scale-105 transition-all rounded-full p-1 cursor-pointer"
                  onClick={() => setIsNewOpen((prev) => !prev)}
                >
                  <SVG
                    src="/icons/new.svg"
                    className="h-8 w-8 fill-white"
                    loader={<div className="h-8 w-8" />}
                  />
                </Link>
                <button
                  className="border border-white/20 px-2 py-1 rounded-lg"
                  onClick={logout}
                >
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-5 flex-col items-end">
                  <button
                    className="bg-blue-500 hover:bg-indigo-500 hover:scale-105 transition rounded-lg px-2 py-1"
                    onClick={() => googleAuth()}
                  >
                    Log In
                  </button>
                </div>
              </>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
