export const editSearchParams = (queryObj, searchParams) => {
  const params = new URLSearchParams(searchParams);
  Object.keys(queryObj).forEach((key) => {
    if (queryObj[key] === "deleteParam") {
      params.delete(key);
    } else {
      params.set(key, queryObj[key]);
    }
  });
  return params.toString();
};
