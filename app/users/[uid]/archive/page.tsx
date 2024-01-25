import { useAuth } from "@context/AuthContext";
import { getUserLibrary } from "@firebase/hooks";
import { useQuery } from "@tanstack/react-query";
import { IUseAuth } from "@utils/declarations";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ArchivePage = () => {
  const {
    currentUser,
    isLoading: userLoading,
    logout,
    deleteAccount,
  }: IUseAuth = useAuth();
  const router = useRouter();
  const pathParams = useParams();
  const {
    data,
    error,
    isLoading: queryLoading,
    isError,
  } = useQuery({
    queryKey: ["userSets", { user: pathParams.uid }],
    queryFn: () => getUserLibrary(pathParams.uid as string, 20),
  });

  useEffect(() => {
    if (!userLoading) {
      if (currentUser?.uid !== pathParams.uid || !currentUser)
        router.push(`/users/${pathParams.uid}/studySets`);
    }
  }, [userLoading, currentUser, pathParams]);

  if (userLoading || queryLoading) return <div>loading</div>;
  if (currentUser?.uid !== pathParams.uid || !currentUser)
    return <div>loading</div>;
  if (error) return <div>{error.message}</div>;
  return;
};
