import { User } from "firebase/auth";
import { DocumentData, Timestamp } from "firebase/firestore";
import { SearchOptions, Suggestion } from "minisearch";

export interface IuseQuery {
  data: object | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error;
}

export interface IgetUserLibrary {
  id: string;
  title: string;
}

export interface IuserInfo {
  photoURL: string;
  displayName: string;
  email: string;
}

export interface IUserDisplayInfo {
  displayName: string;
  photoURL: string;
  id: string;
}

export interface IsetCard {
  definition: string;
  term: string;
  timestamp: Timestamp;
}

export interface ILibraryCard {
  title: string;
  description: string;
  id: string;
  creator: string;
}

export interface IUseAuth {
  currentUser?: User | null;
  uid?: string;
  googleAuth?: () => Promise<User | unknown>;
  facebookAuth?: () => Promise<User | unknown>;
  githubAuth?: () => Promise<User | unknown>;
  signUp?: (
    email: string,
    password: string,
    username: string
  ) => Promise<User | unknown>;
  logIn?: (email: string, password: string) => Promise<User | unknown>;
  logout?: () => Promise<void>;
  deleteAccount?: () => Promise<void | null>;
  isLoading?: boolean;
}

export interface IUseSearch {
  autoSuggest?: (query: string, options?: SearchOptions | undefined) => void;
  suggestions?: Suggestion[] | null;
  users?: IUserDisplayInfo[];
  studySets?: ILibraryCard[];
  isSearchLoading?: boolean;
  creatorsData?: unknown;
  creatorsIsLoading?: boolean;
  creatorsIsError?: boolean;
  creatorsError?: Error | null;
}

interface IStudySetHead {
  description: string;
  title: string;
}

export interface IStudySet {
  head: IStudySetHead;
  body: { [key: string]: DocumentData };
  creator: string;
  id: string;
  isPublic: boolean;
}
