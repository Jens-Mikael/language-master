import { editSearchParams } from "@utils/functions";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import Link from "next/link";
import { useSearch } from "@context/SearchContext";
import { SearchOptions, Suggestion } from "minisearch";

interface IProps {
  setIsSearchOpen: (isOpen: boolean) => void;
}
interface IUseSearch {
  suggestions?: Suggestion[];
  autoSuggest?: (query: string, options?: SearchOptions | undefined) => void;
}

const SearchBar = ({ setIsSearchOpen }: IProps) => {
  const [input, setInput] = useState("");
  const [showSugg, setShowSugg] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const setSearchParams = useCallback(
    (queryObj: object) => editSearchParams(queryObj, searchParams),
    []
  );

  const { suggestions, autoSuggest }: IUseSearch = useSearch();

  useEffect(() => autoSuggest(input), [input]);
  return (
    <div
      className={`grow w-full max-w-3xl items-center justify-center text-sm relative flex`}
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
        }}
        onClick={() => setShowSugg(true)}
        onFocus={() => setShowSugg(true)}
        onBlur={(e) => {
          if (e?.relatedTarget?.hasAttribute("name")) {
            if (e?.relatedTarget) setShowSugg(false);
          }
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            setShowSugg(false);
            setIsSearchOpen(false);
            e.currentTarget.blur();
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
          {suggestions.map((obj: Suggestion) => (
            <Link
              className="hover:bg-white/5 py-1 px-3 flex gap-2"
              link-name="suggestion"
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
