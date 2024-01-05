import { ReadonlyURLSearchParams } from "next/navigation";

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
