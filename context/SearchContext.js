"use client";
import { getPublicSets, getStudySetsCreators } from "@/firebase/hooks";
import { getEveryUser } from "@/firebase/hooks/read";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useMiniSearch } from "react-minisearch";

const SearchContext = createContext();

export const useSearch = () => {
  return useContext(SearchContext);
};

export const SearchProvider = ({ children }) => {
  const [enableFetch, setEnableFetch] = useState(false);
  const [users, setUsers] = useState([]);
  const [studySets, setStudySets] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(true);
  const [initial, setInitial] = useState(true);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  //fetch public sets
  const { data: setsData } = useQuery({
    queryKey: ["publicSets"],
    queryFn: async () => {
      const data = await getPublicSets();
      await addAllAsync(data);
      return data;
    },
  });

  //fetch every user
  const { data: everyUserData } = useQuery({
    queryKey: ["everyUser"],
    queryFn: async () => {
      const data = await getEveryUser();
      await addAllAsync(data);
      return data;
    },
  });

  const {
    autoSuggest,
    suggestions,
    addAllAsync,
    search,
    searchResults,
    isIndexing,
  } = useMiniSearch([], miniSearchOptions);

  const {
    data: creatorsData,
    isLoading: creatorsIsLoading,
    isError: creatorsIsError,
    error: creatorsError,
  } = useQuery({
    queryFn: () => getStudySetsCreators(Uidize(searchResults)),
    queryKey: ["creatorsData", { searchQuery: searchParams.get("query") }],
    enabled: enableFetch,
  });

  const Uidize = useCallback(
    (searchResults) => {
      const arr = [];
      Object.keys(searchResults).forEach((key) => {
        if (
          !arr.includes(searchResults[key].creator) &&
          !searchResults[key].hasOwnProperty("displayName")
        )
          arr.push(searchResults[key].creator);
      });
      return arr;
    },
    [searchResults]
  );

  useMemo(() => {
    if (searchResults && searchResults.length !== 0) {
      const users = [];
      const studySets = [];
      searchResults.forEach((obj) => {
        if (obj.hasOwnProperty("displayName")) users.push(obj);
        else studySets.push(obj);
      });
      return (
        setUsers(users),
        setStudySets(studySets),
        studySets.length !== 0 && setEnableFetch(true)
      );
    } else {
      return setUsers([]), setStudySets([]), setEnableFetch(false);
    }
  }, [searchResults]);

  useEffect(() => {
    if (searchResults) {
      setIsSearchLoading(false);
    }
  }, [searchResults]);

  useEffect(() => {
    if (
      pathname.includes("/search") &&
      searchParams.get("query") &&
      setsData &&
      everyUserData &&
      (!isSearchLoading || initial)
    ) {
      setInitial(false);
      search(searchParams.get("query"));
      console.log("search ran");
      setIsSearchLoading(true);
    }
  }, [searchParams.get("query"), setsData, everyUserData]);

  const value = {
    autoSuggest,
    suggestions,
    users,
    studySets,
    isSearchLoading,
    creatorsData,
    creatorsIsLoading,
    creatorsIsError,
    creatorsError,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export const miniSearchOptions = {
  fields: ["title", "description", "displayName"],
  storeFields: ["title", "description", "id"],
  searchOptions: {
    boost: { title: 2, description: 1 },
    prefix: true,
    fuzzy: 0.25,
  },
};
