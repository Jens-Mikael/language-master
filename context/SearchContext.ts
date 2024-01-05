"use client";
import { getPublicSets, getStudySetsCreators } from "@firebase/hooks";
import { getEveryUser } from "@firebase/hooks/read";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useMiniSearch,  } from "react-minisearch";
import { ILibraryCard, IUserDisplayInfo } from "../declarations";

const SearchContext = createContext({});

export const useSearch = () => {
  return useContext(SearchContext);
};

interface IProps {
  children?: ReactNode;
}

export const SearchProvider = ({ children }: IProps) => {
  const [enableFetch, setEnableFetch] = useState(false);
  const [users, setUsers] = useState<any[] | object[]>([]);
  const [studySets, setStudySets] = useState<any[] | object[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(true);
  const [initial, setInitial] = useState(true);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const {
    autoSuggest,
    suggestions,
    addAllAsync,
    addAll,
    search,
    searchResults,
    isIndexing,
  } = useMiniSearch([], miniSearchOptions);

  //fetch public sets
  const { data: setsData } = useQuery<ILibraryCard[]>({
    queryKey: ["publicSets"],
    queryFn: async () => {
      const data: ILibraryCard[] = await getPublicSets();
      await addAllAsync(data);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  //fetch every user
  const { data: everyUserData } = useQuery({
    queryKey: ["everyUser"],
    queryFn: async () => {
      const data = await getEveryUser();
      await addAllAsync(data);
      return data;
    },
    refetchOnWindowFocus: false,
  });



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
    (searchResults: string[]) => {
      const arr: string[] = [];
      searchResults.map((obj: Object)=> {
        if (
        !arr.includes(obj.creator) &&
        !searchResults[i as keyof object].hasOwnProperty("displayName")
      )
        arr.push(searchResults[i as keyof object].i);
      })

      return arr;
    },
    [searchResults]
  );
  console.log(searchResults)

  useMemo(() => {
    if (searchResults && searchResults.length !== 0) {
      const users: object[] = [];
      const studySets: object[] = [];
      searchResults.forEach((obj: object) => {
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
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
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
