import { Timestamp } from "firebase/firestore";

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

export interface ISuggestion {
  
}
