"use client";
import { usePathname } from "next/navigation";
import { croissantOne } from "@/app/fonts";
import SVG from "react-inlinesvg";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/firebase/context/AuthContext";
import AuthPage from "./AuthPage";

const newDropdown = [
  {
    title: "Study set",
    link: "/create-set",
  },
  {
    title: "Study set",
    link: "/create-set",
  },
  {
    title: "Study set",
    link: "/create-set",
  },
  {
    title: "Study set",
    link: "/create-set",
  },
];

const Navbar = () => {
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [input, setInput] = useState("");
  const [authType, setAuthType] = useState("");

  const { currentUser } = useAuth();

  const pathName = usePathname();

  return (
    <div className="flex border-b border-white/20 px-10 whitespace-nowrap gap-8">
      {/* FIRST SECTION */}
      <div className="flex gap-5 items-center">
        <Link
          href="/"
          className={`${croissantOne.className} text-3xl py-3 pr-2`}
        >
          Language Mastery
        </Link>
        <Link href="/home" className="relative h-full items-center flex group">
          Home
          <div
            className={`${
              pathName === "/home" ? "h-1" : "group-hover:h-1 h-0"
            } absolute bottom-0 w-full bg-blue-500 rounded transition-all`}
          />
        </Link>

        <Link
          href="/library"
          className="relative h-full items-center flex group"
        >
          <div className="flex gap-2">
            Your Library
            <SVG
              src="icons/arrow-down.svg"
              className="h-6 w-6 fill-white"
              loader={<div className="h-6 w-6" />}
            />
          </div>
          <div
            className={`${
              pathName === "/library" ? "h-1" : "group-hover:h-1 h-0"
            } absolute bottom-0 w-full bg-blue-500 rounded transition-all`}
          />
        </Link>
      </div>
      {/* SEARCH BAR */}
      <div className="grow min-w-[200px] items-center justify-center flex text-sm relative">
        <SVG
          src="icons/search.svg"
          className="h-6 w-6 fill-white absolute left-3"
          loader={<div className="h-6 w-6" />}
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
          src="icons/remove.svg"
          className={`h-6 w-6 fill-white absolute right-3 cursor-pointer ${
            !input && "hidden"
          }`}
          onClick={() => setInput("")}
          loader={<div className="h-6 w-6" />}
        />
      </div>
      {/* LAST SECTION */}
      <div className="flex gap-8 items-center">
        <div className="relative h-full flex items-center">
          <div
            className="z-20 bg-blue-500 hover:bg-blue-600 transition-all rounded-full p-1 cursor-pointer"
            onClick={() => setIsNewOpen((prev) => !prev)}
          >
            <SVG
              src="icons/new.svg"
              className="h-8 w-8 fill-white"
              loader={<div className="h-8 w-8" />}
            />
          </div>
          {/* DROPDOWN */}
          {isNewOpen && (
            <>
              <div className="flex z-20 absolute top-full right-0 mt-2 border border-white/20 rounded-xl flex-col overflow-hidden bg-[#0A092D]">
                {newDropdown.map((i) => (
                  <Link
                    onClick={() => setIsNewOpen(false)}
                    href={i.link}
                    className="hover:bg-white/10 p-2"
                  >
                    {i.title}
                  </Link>
                ))}
              </div>
              <div
                className="z-10 fixed inset-0"
                onClick={() => setIsNewOpen(false)}
              />
            </>
          )}
        </div>
        <div className="flex gap-3">
          {currentUser ? (
            <>
              <div>Notifications</div>
              <div>Profile</div>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsAuthOpen(true);
                  setAuthType("logIn");
                }}
                className="border border-white/20 px-2 py-1 rounded-lg"
              >
                Log in
              </button>
              <button
                onClick={() => {
                  setIsAuthOpen(true);
                  setAuthType("signUp");
                }}
                className="bg-cyan-400 hover:bg-opacity-80 rounded-lg px-2 py-1"
              >
                Sign up
              </button>
              <div
                className={`absolute inset-0 z-40 bg-black/80 transition duration-500 ${
                  isAuthOpen
                    ? " translate-y-0 opacity-100"
                    : "-translate-y-full opacity-0"
                }`}
              >
                <AuthPage
                  setIsAuthOpen={setIsAuthOpen}
                  authType={authType}
                  setAuthType={setAuthType}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
