import { useAuth } from "@context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SVG from "react-inlinesvg";
import LibraryDropdown from "./LibraryDropdown";
import MobileTap from "./MobileTap";
import Image from "next/image";
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const { googleAuth, logout, isLoading, currentUser } = useAuth();
  const pathname = usePathname();
  return (
    <div
      className={` fixed right-0 inset-0 z-20 flex lg:hidden transition duration-500 ${
        sidebarOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div onClick={() => setSidebarOpen(false)} className="flex-1" />
      {/* content */}
      <div className="h-full bg-[#0A092D] overflow-y-scroll w-[250px] shadow-xl flex flex-col gap-5 p-2 border-l border-white/20">
        <div className="flex flex-col gap-[7px]">
          <div className="flex justify-between">
            <div className="p-2 text-lg">Menu</div>
            <MobileTap
              onClick={() => setSidebarOpen(false)}
              className="cursor pointer p-2"
            >
              <SVG
                src="/icons/remove.svg"
                className="h-7 w-7 fill-white"
                loader={<div className="h-7 w-7" />}
              />
            </MobileTap>
          </div>
          <div className="border-b border-white/20" />
        </div>

        {/* items */}
        <div className="flex flex-col gap-8">
          {/* NAVIGATION */}
          <div className="gap-4 flex sm:hidden flex-col">
            <Link
              href="/home"
              onClick={() => setSidebarOpen(false)}
              className={`relative w-full pl-4 group`}
            >
              <div
                className={`${
                  pathname === "/home" ? "w-1" : "group-hover:w-1 w-0"
                } absolute left-0  h-full bg-blue-500 rounded transition-all`}
              />
              Home
            </Link>

            <div
              className={`relative flex pl-4 group`}
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
                  pathname === "/library" ? "w-1" : "group-hover:w-1 w-0"
                } absolute left-0 h-full bg-blue-500 rounded transition-all`}
              />
            </div>
            {isLibraryOpen && (
              <div className="pl-5">
                <LibraryDropdown
                  setIsLibraryOpen={setIsLibraryOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              </div>
            )}
          </div>

          {/* OTHER FUNCTIONS */}
          <div className="flex flex-col gap-4 px-2">
            {!isLoading &&
              (currentUser ? (
                <>
                  <Link
                    className="rounded-full hover:scale-105 transition overflow-hidden w-fit"
                    href={`/users/${currentUser.uid}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Image
                      src={currentUser.photoURL}
                      alt="pfp"
                      height={40}
                      width={40}
                    />
                  </Link>
                  <MobileTap>
                    <Link
                      href="/create-set"
                      className={`z-20 bg-blue-600 transition-all rounded-full pl-2 pr-3 py-1 cursor-pointer w-fit flex gap-1 items-center hover:bg-indigo-600 hover:scale-105`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <SVG
                        src="/icons/new.svg"
                        className="h-8 w-8 fill-white"
                        loader={<div className="h-8 w-8" />}
                      />
                      Create Set
                    </Link>
                  </MobileTap>
                  <MobileTap
                    className="border border-white/20 px-2 py-1 rounded-lg  w-fit"
                    onClick={() => {
                      setSidebarOpen(false);
                      logout();
                    }}
                  >
                    Log Out
                  </MobileTap>
                </>
              ) : (
                <>
                  <MobileTap
                    className="bg-blue-500 hover:bg-indigo-500 hover:scale-105 transition rounded-lg px-3 py-1 w-fit"
                    onClick={() => {
                      setSidebarOpen(false);
                      googleAuth();
                    }}
                  >
                    Log In
                  </MobileTap>
                </>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
