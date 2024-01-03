"use client";

import MobileTap from "@/components/MobileTap";
import { useAuth } from "@/context/AuthContext";
import { useSearch } from "@/context/SearchContext";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const SearchStudySetsPage = () => {
  const searchParams = useSearchParams();
  const { currentUser } = useAuth();

  const { studySets, creatorsIsLoading, creatorsData, isSearchLoading } =
    useSearch();

  if (isSearchLoading) return <div>loading</div>;
  return (
    <div>
      {studySets && studySets.length >= 1 ? (
        <div className="grid grid-cols-1 gap-5 sm:gap-5 md:grid-cols-2 w-full">
          {studySets.map((obj, i) => (
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
          ))}
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

export default SearchStudySetsPage;
