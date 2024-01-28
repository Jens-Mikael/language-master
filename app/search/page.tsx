"use client";

import MobileTap from "@components/MobileTap";
import { useAuth } from "@context/AuthContext";
import { useSearch } from "@context/SearchContext";
import { editSearchParams } from "@utils/functions";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback } from "react";
import { IUseAuth, IUseSearch } from "../../utils/declarations";

const AllSearchResultsPage = () => {
  const searchParams = useSearchParams();
  const { currentUser }: IUseAuth = useAuth();
  const {
    users,
    studySets,
    isSearchLoading,
    creatorsData,
    creatorsIsError,
    creatorsError,
    creatorsIsLoading,
  }: IUseSearch = useSearch();
  const editParams = useCallback(
    (obj: object) => editSearchParams(obj, searchParams),
    [searchParams]
  );

  if (isSearchLoading) return <div>loading</div>;
  if (creatorsIsError) return <div>{creatorsError?.message}</div>;
  return (
    <div className=" flex flex-col gap-10">
      {(!users || users?.length === 0) &&
        (!studySets || studySets.length === 0) && (
          <div className="text-lg flex">
            No results for "
            <div className="italic">{searchParams.get("query")}</div>"
          </div>
        )}
      {users && users.length >= 1 && (
        <div className="flex flex-col gap-5">
          <div className="font-medium text-2xl">Users</div>
          <div className="grid grid-cols-1 gap-5 sm:gap-5 md:grid-cols-2 w-full">
            {users.map((obj, i) => {
              if (i >= 2) return;
              return (
                <MobileTap
                  key={obj.id}
                  className="group hover:scale-105 transition w-full bg-indigo-600/20 rounded-xl relative overflow-hidden"
                >
                  <Link
                    href={`/users/${obj.id}/${
                      obj.id !== currentUser?.uid ? "studySets" : ""
                    }`}
                    className="flex items-center py-5 px-5 sm:px-10 gap-5"
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
              );
            })}
          </div>
          <Link
            className="self-end font-bold text-blue-600 hover:text-indigo-600/90 transition"
            href={`/search/users?${editParams({})}`}
          >
            {" "}
            View All
          </Link>
        </div>
      )}
      {studySets && studySets.length >= 1 && (
        <div className="flex flex-col gap-5">
          <div className="font-medium text-2xl">Study Sets</div>
          <div className="grid grid-cols-1 gap-5 sm:gap-5 md:grid-cols-2 w-full">
            {studySets.map((obj, i) => {
              if (i >= 2) return;
              return (
                <MobileTap
                  key={obj.id}
                  className="group hover:scale-105 transition w-full h-[160px] bg-white/20 rounded-xl text-start truncate relative"
                >
                  <Link href={`/sets/${obj.id}`}>
                    <div className="gap-10 flex flex-col justify-between p-5 h-full">
                      <div className="flex flex-col gap-2">
                        <div className="font-medium text-xl">{obj.title}</div>
                        <div className="italic text-sm">{obj.description}</div>
                      </div>

                      <Link
                        href={`/users/${obj.creator}/${
                          obj.creator === currentUser?.uid ? "" : "studySets"
                        }`}
                        className="flex gap-3 items-center hover:scale-105 transition w-fit"
                      >
                        {!creatorsIsLoading && creatorsData && (
                          <>
                            <Image
                              className="rounded-full"
                              width={24}
                              height={24}
                              src={creatorsData[obj.creator].photoURL}
                              alt="usr photoURL"
                            />
                            <div className="font-medium text-sm">
                              {creatorsData[obj.creator].displayName}
                            </div>
                          </>
                        )}
                      </Link>
                    </div>
                    <div className="group-hover:h-1 h-0 w-full absolute bottom-0 bg-blue-500 transition-all" />
                  </Link>
                </MobileTap>
              );
            })}
          </div>
          <Link
            className="self-end font-bold text-blue-600 hover:text-indigo-600/90 transition"
            href={`/search/studySets?${editParams({})}`}
          >
            {" "}
            View All
          </Link>
        </div>
      )}
    </div>
  );
};

const SuspensedAllSearchResultsPage = () => (
  <Suspense>
    <AllSearchResultsPage />
  </Suspense>
);

export default SuspensedAllSearchResultsPage;
