"use client";
import SetEditor from "@components/SetEditor";
import { useAuth } from "@context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { IUseAuth } from "../../../utils/declarations";
import { getStudySet } from "@firebase/hooks";
import Loader from "@components/Loader";

const EditSetPage = () => {
  const { currentUser, isLoading: userLoading }: IUseAuth = useAuth();
  const router = useRouter();
  const pathParams = useParams();
  const {
    data,
    isLoading: dataLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [pathParams.id],
    queryFn: () => getStudySet(pathParams.id as string),
  });
  useEffect(() => {
    if (!userLoading && !dataLoading)
      if (!currentUser || !data) router.push("/");
  }, [currentUser, router, userLoading, dataLoading, data]);

  if (dataLoading || userLoading) return <Loader />;
  if (isError) return <div>{error.message}</div>;
  if (currentUser?.uid === data?.creator)
    return (
      <>
        <SetEditor uid={currentUser!.uid} type={pathParams.id as string} />
      </>
    );
};

export default EditSetPage;
