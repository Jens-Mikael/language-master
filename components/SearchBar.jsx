import { editSearchParams } from "@/utils/functions";
import provideSets, { miniSearchOptions } from "@/utils/provideSets";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useMiniSearch } from "react-minisearch";
import SVG from "react-inlinesvg";
import { getPublicSets } from "@/firebase/hooks";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const SearchBar = () => {
  const [input, setInput] = useState("");
  const [showSugg, setShowSugg] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const setSearchParams = useCallback(
    (queryObj) => editSearchParams(queryObj, searchParams),
    []
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["publicSets"],
    queryFn: async () => {
      const data = await getPublicSets();
      addAllAsync(data);
      return data;
    },
  });

  const { autoSuggest, suggestions, clearSuggestions, addAllAsync } =
    useMiniSearch([], miniSearchOptions);

  return (
    <div
      className={`grow min-w-[200px] max-w-3xl items-center justify-center text-sm relative flex`}
    >
      <SVG
        src="/icons/search.svg"
        className="h-6 w-6 fill-white absolute left-3 "
        loader={<div className="h-6 w-6 absolute left-3" />}
      />

      <input
        type="text"
        placeholder="Search for anything..."
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          autoSuggest(input);
        }}
        onClick={() => setShowSugg(true)}
        onFocus={() => setShowSugg(true)}
        
        onBlur={(e) => {
          if (e?.relatedTarget?.name !== "link") {
            setShowSugg(false);
          }
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            setShowSugg(false);
            router.push(`/search?${setSearchParams({ query: input })}`);
          }
        }}
        className={`peer w-full bg-white/20 outline-none focus:ring-[2px] ring-white rounded-full py-2 transition ${
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
      {/* SEARCH SUGGESTIONS */}
      {showSugg && suggestions && suggestions.length >= 1 && (
        <div className="z-20 absolute top-full flex flex-col py-2 mt-2 bg-[#0A092D] border border-white/20 left-0 w-full rounded-xl overflow-hidden">
          {suggestions.map((obj) => (
            <Link
              className="hover:bg-white/5 py-1 px-3 flex gap-2"
              name="link"
              key={obj.suggestion}
              onClick={() => setShowSugg(false)}
              href={`/search?${setSearchParams({ query: obj.suggestion })}`}
            >
              <SVG
                src="/icons/search.svg"
                className="h-5 w-5 fill-white "
                loader={<div className="h-5 w-5" />}
              />
              {obj.suggestion}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
