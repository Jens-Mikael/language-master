import { ReadonlyURLSearchParams } from "next/navigation";
import { ILibraryCard } from "./declarations";

export const editSearchParams = (
  queryObj: object,
  searchParams: ReadonlyURLSearchParams
) => {
  const params = new URLSearchParams(searchParams);
  Object.keys(queryObj).forEach((key) => {
    if (queryObj[key as keyof object] === "deleteParam") {
      params.delete(key);
    } else {
      params.set(key, queryObj[key as keyof object]);
    }
  });
  return params.toString();
};

export const timestampSort = (a: ILibraryCard, b: ILibraryCard) => {
  if (!a.timestamp?.seconds) return 1;
  if (!b.timestamp?.seconds) return -1;
  if (a.timestamp.seconds > b.timestamp.seconds) return -1;
  if (a.timestamp.seconds < b.timestamp.seconds) return 1;
  return 0;
};
