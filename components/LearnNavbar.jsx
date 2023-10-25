"use client";
import SVG from "react-inlinesvg";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const LearnNavbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const params = useParams();
  return (
    <div className="flex justify-center items-center relative px-6 py-4">
      <div className="flex justify-between w-full">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="py-2 px-3 flex gap-2 items-center group hover:bg-white/10 border-white/30 border-2 rounded-lg"
          >
            <SVG
              src="/icons/flashcards.svg"
              className="h-10 w-10 fill-blue-500"
              loader={<div className="h-10 w-10" />}
            />
            <div className="text-lg font-medium">Flashcards</div>
            <SVG
              src="/icons/arrow-down.svg"
              className="fill-white h-6 w-6"
              loader={<div className="h-6 w-6" />}
            />
          </button>
          {isDropdownOpen && (
            <>
              <div className="absolute top-full mt-2 bg-[#0A092D] z-20 flex flex-col border border-white/20 rounded-lg overflow-hidden">
                <Link
                  href="write"
                  className={`py-2 px-3 flex gap-2 items-center hover:bg-white/10 ${params}`}
                >
                  <SVG
                    src="/icons/write.svg"
                    className="h-8 w-8 fill-blue-500"
                    loader={<div className="h-8 w-8" />}
                  />
                  <div className="font-medium">Write</div>
                </Link>
                <Link
                  href="flashcards"
                  className="py-2 px-3 flex gap-3 items-center hover:bg-white/10"
                >
                  <SVG
                    src="/icons/flashcards.svg"
                    className="h-7 w-7 fill-blue-500"
                    loader={<div className="h-7 w-7" />}
                  />
                  <div className="font-medium">Flashcards</div>
                </Link>
              </div>
              <div
                className="z-10 fixed inset-0"
                onClick={() => setIsDropdownOpen(false)}
              />
            </>
          )}
        </div>
        <Link
          href={`/learn/${params.id}`}
          className="bg-white/0 hover:bg-white/10 rounded-lg border-2 border-white/30 p-1.5 items-center flex h-min"
        >
          <SVG
            src="/icons/remove.svg"
            className="fill-white h-6 w-6"
            loader={<div className="h-6 w-6" />}
          />
        </Link>
      </div>
      <div className="absolute items-center flex-col flex font-medium">
        <div className="text-xl">1 / 22</div>
        <div>Deutche Verben</div>
      </div>
    </div>
  );
};

export default LearnNavbar;
