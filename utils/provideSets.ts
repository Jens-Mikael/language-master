// import { getPublicSets } from "@firebase/hooks";
// import { useQuery } from "@tanstack/react-query";
// import { ILibraryCard } from "../declarations";
// import { getEveryUser } from "@firebase/hooks/read";
// import { Component } from "react";

// const provideSets = (Component: Component) => {
  
//   const ProvideSets = (props) => {
//     //fetch public sets
//   const { data: setsData, isLoading: setsIsLoading } = useQuery<ILibraryCard[]>({
//     queryKey: ["publicSets"],
//     queryFn: () => getPublicSets(),
//     refetchOnWindowFocus: false,
//   });

//   //fetch every user
//   const { data: everyUserData, isLoading: usersIsLoading } = useQuery({
//     queryKey: ["everyUser"],
//     queryFn: () => getEveryUser,
//     refetchOnWindowFocus: false,
//   });



//     return <Component documents={data} {...props} />;
//   };

//   return ProvideSets;
// };

// export default provideSets;

