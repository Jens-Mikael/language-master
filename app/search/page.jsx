"use client";
import MobileTap from "@/components/MobileTap";
import { getStudySetsCreators } from "@/firebase/hooks";
import provideSets, { miniSearchOptions } from "@/utils/provideSets";
import { useQuery } from "@tanstack/react-query";
import { enableMultiTabIndexedDbPersistence } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useMiniSearch } from "react-minisearch";

const SearchPage = ({ publicSets }) => {
  const [enableFetch, setEnableFetch] = useState(false);
  const { search, searchResults } = useMiniSearch(
    publicSets,
    miniSearchOptions
  );
  const searchParams = useSearchParams();
  useEffect(() => {
    search(searchParams.get("query"));
  }, [searchParams]);

  useEffect(() => {
    if (searchResults) setEnableFetch(true);
  }, [searchResults]);

  const Uidize = () => {
    const arr = [];
    Object.keys(searchResults).forEach((key) => {
      if (!arr.includes(searchResults[key].creator))
        arr.push(searchResults[key].creator);
    });
    return arr;
  };

  const {
    data: creatorsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: () => getStudySetsCreators(Uidize()),
    queryKey: ["creatorsData", { searchQuery: searchParams.get("query") }],
    enabled: enableFetch,
  });

  if (!searchResults || isLoading) return <div>loading</div>;
  if (isError) return <div>{error.message}</div>;

  return (
    <div className="flex justify-center">
      <div className="flex flex-col max-w-5xl gap-10 w-full">
        {/* HEADER */}
        <div className="text-xl font-bold">{`Results for "${searchParams.get(
          "query"
        )}"`}</div>
        {/* RESULTS */}
        <div>
          <div className="grid grid-cols-1 gap-5 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3 w-full">
            {searchResults.map((obj) => (
              <MobileTap className="group hover:scale-105 transition w-full h-[160px] bg-white/20 rounded-xl text-start truncate relative">
                <Link href={`/sets/${obj.id}`}>
                  <div className="gap-10 flex flex-col justify-between p-5 h-full">
                    <div className="flex flex-col gap-2">
                      <div className="font-medium text-lg">{obj.title}</div>
                      <div className=" italic text-sm">{obj.description}</div>
                    </div>

                    <div className="flex gap-3 items-center">
                      <Image
                        className="rounded-full"
                        width={24}
                        height={24}
                        src={
                          !isLoading &&
                          creatorsData &&
                          creatorsData[obj.creator].photoURL
                        }
                        alt="usr photoURL"
                      />
                      <div className="font-medium text-sm">
                        {!isLoading &&
                          creatorsData &&
                          creatorsData[obj.creator].displayName}
                      </div>
                    </div>
                  </div>
                  <div className="group-hover:h-1 h-0 w-full absolute bottom-0 bg-blue-500 transition-all" />
                </Link>
              </MobileTap>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default provideSets(SearchPage);
