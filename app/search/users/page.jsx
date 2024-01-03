"use client";

import MobileTap from "@/components/MobileTap";
import { useAuth } from "@/context/AuthContext";
import { useSearch } from "@/context/SearchContext";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const SearchUsersPage = () => {
  const searchParams = useSearchParams();
  const { currentUser } = useAuth();
  const { users, isSearchLoading } = useSearch();
  if (isSearchLoading) return <div>loading</div>;
  return (
    <div>
      {users && users.length >= 1 ? (
        <div className="flex flex-col gap-5">
          <div className="font-medium text-2xl">Users</div>
          <div className="grid grid-cols-1 gap-5 sm:gap-5 md:grid-cols-2 w-full">
            {/* FILTER SEARCH RESULTS INTO SEPARATE ARRAYS  */}
            {users.map((obj, i) => (
              <MobileTap className="group hover:scale-105 transition w-full bg-indigo-600/20 rounded-xl truncate relative">
                <Link
                  href={`/users/${obj.id}/${
                    obj.id !== currentUser?.uid ? "studySets" : ""
                  }`}
                  className="flex items-center w-fit py-5 px-5 sm:px-10 gap-5"
                >
                  <>
                    <Image
                      className="rounded-full"
                      width={52}
                      height={52}
                      src={obj.photoURL}
                      alt="usr photoURL"
                    />
                    <div className="font-medium text-lg sm:text-xl">
                      {obj.displayName}
                    </div>
                  </>
                </Link>
                <div className="group-hover:h-1 h-0 w-full absolute bottom-0 bg-indigo-500 transition-all" />
              </MobileTap>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex text-lg">
          No results for "
          <div className="italic">{searchParams.get("query")}</div>"
        </div>
      )}
    </div>
  );
};

export default SearchUsersPage;
