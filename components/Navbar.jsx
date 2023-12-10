"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { croissantOne } from "@/app/fonts";
import SVG from "react-inlinesvg";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/firebase/context/AuthContext";
import LibraryDropdown from "./LibraryDropdown";
import Sidebar from "./Sidebar";
import { useCallback } from "react";
import { editSearchParams } from "@/functions";

const newDropdown = [
  {
    title: "Study set",
    link: "/create-set",
  },
];

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [input, setInput] = useState("");
  const pathname = usePathname();
  // const searchParams = useSearchParams();
  // const router = useRouter();

  const { currentUser, isLoading, googleAuth, logout } = useAuth();

  // const setSearchParams = useCallback(
  //   (queryObj) => editSearchParams(queryObj, searchParams)[searchParams]
  // , []);
  return (
    <>
      <div className="flex border-b border-white/20 px-10 whitespace-nowrap gap-8 h-[60px]">
        {/* FIRST SECTION */}
        <div className="flex gap-5 items-center ">
          <Link
            href="/"
            className={`${croissantOne.className} text-3xl py-3 pr-2 flex h-full items-center`}
          >
            Language Mastery
          </Link>
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
        </div>
        {/* SEARCH BAR */}
        <div className="grow min-w-[200px] items-center justify-center flex text-sm relative">
          <SVG
            src="/icons/search.svg"
            className="h-6 w-6 fill-white absolute left-3"
            loader={<div className="h-6 w-6 absolute left-3" />}
          />
          <input
            type="text"
            placeholder="Search for anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`w-full bg-white/20 focus:ring-none focus:outline outline-white rounded-full py-2 transition ${
              input ? "px-11" : "pr-2 pl-11"
            }`}
          />
          <SVG
            src="/icons/remove.svg"
            className={`h-6 w-6 fill-white absolute right-3 cursor-pointer ${
              !input && "hidden"
            }`}
            onClick={() => setInput("")}
            loader={<div className="h-6 w-6 absolute right-3" />}
          />
        </div>
        {/* LAST SECTION */}
        <div className="lg:flex hidden gap-8 items-center">
          {!isLoading &&
            (currentUser ? (
              <div className="relative h-full flex items-center gap-5">
                <Link
                  href="/create-set"
                  className="z-20 bg-blue-600 hover:bg-indigo-600 hover:scale-105 transition-all rounded-full p-1 cursor-pointer"
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
                <div className="flex gap-3">
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
        {/* SIDEBAR */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-full group cursor-pointer"
          >
            <SVG
              className="h-7 w-7 fill-white transition group-hover:scale-110 group-hover:fill-indigo-500"
              src="/icons/ham-menu.svg"
              loader={<div className="h-7 w-7" />}
            />
          </button>
        </div>
      </div>
      <Sidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
    </>
  );
};

export default Navbar;

