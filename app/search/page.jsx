"use client";
import provideSets, { miniSearchOptions } from "@/utils/provideSets";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useMiniSearch } from "react-minisearch";

const SearchPage = ({ publicSets }) => {
  const {
    search,
    searchResults,
    clearSearch,
    autoSuggest,
    suggestions,
    clearSuggestions,
    isIndexing,
  } = useMiniSearch(publicSets, miniSearchOptions);
  const searchParams = useSearchParams();
  useEffect(() => {
    search(searchParams.get("query"));
    console.log(searchParams.get("query"));
  }, [searchParams]);
  console.log(searchResults);
  return <div></div>;
};

export default provideSets(SearchPage);
