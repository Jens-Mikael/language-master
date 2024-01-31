"use client";
import { usePathname } from "next/navigation";
import { croissantOne } from "@app/fonts";
import SVG from "react-inlinesvg";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@context/AuthContext";
import LibraryDropdown from "./LibraryDropdown";
import Sidebar from "./Sidebar";
import MobileTap from "./MobileTap";
import SearchBar from "./SearchBar";
import Image from "next/image";
import { IUseAuth } from "../utils/declarations";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  const { currentUser, isLoading, googleAuth }: IUseAuth = useAuth();

  useEffect(() => {
    if (!pathname.includes("search")) setIsSearchOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="flex border-b border-white/20 px-3 sm:px-5 md:px-10 whitespace-nowrap sm:gap-8 h-[60px] justify-between">
        {/* FIRST SECTION */}
        <div className="flex gap-3 sm:gap-4 md:gap-5 items-center">
          <Link
            href="/"
            className={`${croissantOne.className} text-2xl sm:text-3xl py-3 pr-2 flex h-full items-center`}
          >
            Language Mastery
          </Link>
          <Link
            href="/home"
            className={`relative h-full items-center sm:flex hidden group`}
          >
            Home
            <div
              className={`${
                pathname === "/home" ? "h-1" : "group-hover:h-1 h-0"
              } absolute bottom-0 w-full bg-blue-500 rounded transition-all`}
            />
          </Link>
          {isLoading ? (
            <div className="w-[119px]" />
          ) : (
            currentUser && (
              <div className="h-full relative sm:block hidden">
                <button
                  className={` h-full items-center flex group`}
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
            )
          )}
        </div>

        {/* SEARCH BAR */}

        {isSearchOpen && (
          <div
            className={`lg:hidden fixed z-20 lg:z-0 ${
              pathname.includes("search") ? "inset-x-0" : "inset-0"
            }`}
          >
            <div className="bg-[#0A092D] p-2 gap-3 flex justify-center border-b lg:border-b-0 border-white/20">
              <MobileTap
                onClick={() => setIsSearchOpen(false)}
                className="cursor pointer p-2 group rounded-full"
              >
                <SVG
                  src="/icons/arrow-down.svg"
                  className={`rotate-90 h-7 w-7 fill-white transition group-hover:scale-125 group-hover:fill-indigo-500 `}
                  loader={<div className="h-7 w-7" />}
                />
              </MobileTap>
              <SearchBar setIsSearchOpen={setIsSearchOpen} />
            </div>
            {!pathname.includes("search") && (
              <div onClick={() => setIsSearchOpen(false)} className="h-full" />
            )}
          </div>
        )}
        <div className="lg:flex hidden flex-1 items-center">
          <SearchBar />
        </div>

        {/* LAST SECTION */}
        <div className="lg:flex hidden gap-8 items-center">
          {!isLoading &&
            (currentUser ? (
              <div className="relative h-full flex items-center gap-5">
                <Link
                  href="/create-set"
                  className={`z-20 bg-blue-600 transition-all rounded-full p-1 cursor-pointer hover:bg-indigo-600 hover:scale-105 `}
                >
                  <SVG
                    src="/icons/new.svg"
                    className="h-8 w-8 fill-white"
                    loader={<div className="h-8 w-8" />}
                  />
                </Link>
                <Link
                  className="rounded-full hover:scale-105 transition overflow-hidden"
                  href={`/users/${currentUser.uid}/studySets`}
                >
                  <Image
                    src={currentUser.photoURL!}
                    alt="pfp"
                    height={40}
                    width={40}
                  />
                </Link>
              </div>
            ) : (
              <>
                <div className="flex gap-3">
                  <MobileTap
                    className={`bg-blue-500  transition rounded-lg px-2 py-1 hover:bg-indigo-500 hover:scale-105`}
                    onClick={() => googleAuth && googleAuth()}
                  >
                    Log In
                  </MobileTap>
                </div>
              </>
            ))}
        </div>
        {/* SIDEBAR */}
        <div className="lg:hidden flex items-center gap-1 sm:gap-3">
          {!isSearchOpen && (
            <MobileTap
              onClick={() => setIsSearchOpen(true)}
              className="justify-end group p-2 rounded-full"
            >
              <SVG
                className={`h-7 w-7 fill-white transition hover:fill-indigo-500 hover:scale-105 `}
                loader={<div className="h-7 w-7" />}
                src="/icons/search.svg"
              />
            </MobileTap>
          )}
          <MobileTap
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-full group cursor-pointer"
          >
            <SVG
              className={`h-7 w-7 fill-white transition hover:fill-indigo-500 hover:scale-105`}
              src="/icons/ham-menu.svg"
              loader={<div className="h-7 w-7" />}
            />
          </MobileTap>
        </div>
      </div>
      <Sidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
    </>
  );
};

export default Navbar;
