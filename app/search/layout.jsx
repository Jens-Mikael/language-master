"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { editSearchParams } from "/utils/functions";

import { useCallback } from "react";

const SearchPageLayout = ({ children }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const editParams = useCallback(
    (obj) => editSearchParams(obj, searchParams),
    []
  );

  return (
    <div className="flex justify-center">
      <div className="flex flex-col max-w-5xl gap-8 w-full">
        {/* HEADER */}
        <div className="text-xl font-bold">{`Results for "${searchParams.get(
          "query"
        )}"`}</div>
        <div className="flex items-end whitespace-nowrap">
          <Link
            href={`/search?${editParams({})}`}
            className={`h-full py-3 text-sm font-medium border-b-2 transition cursor-pointer ${
              pathname === `/search`
                ? "border-indigo-500"
                : "border-white/20 hover:border-indigo-500"
            }`}
          >
            All Results
          </Link>
          <div className="w-10 border-b-2 border-white/20" />

          <Link
            href={`/search/studySets?${editParams({})}`}
            className={`h-full py-3 text-sm font-medium border-b-2 transition cursor-pointer w-fit ${
              pathname === `/search/studySets`
                ? "border-indigo-500"
                : "border-white/20 hover:border-indigo-500"
            }`}
          >
            Study Sets
          </Link>
          <div className="w-10 border-b-2 border-white/20" />
          <Link
            href={`/search/users?${editParams({})}`}
            className={`h-full py-3 text-sm font-medium border-b-2 transition cursor-pointer w-fit ${
              pathname === `/search/users`
                ? "border-indigo-500"
                : "border-white/20 hover:border-indigo-500"
            }`}
          >
            Users
          </Link>
          <div className="w-full border-b-2 border-white/20" />
        </div>
        {/* RESULTS */}
        {children}
      </div>
    </div>
  );
};

export default SearchPageLayout;
