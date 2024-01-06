"use client";
import SetEditor from "@components/SetEditor";
import { useAuth } from "@context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { IUseAuth } from "../../../declarations";
import { getStudySet } from "@firebase/hooks";

const EditSetPage = () => {
  const { currentUser }: IUseAuth = useAuth();
  const router = useRouter();
  const pathParams = useParams();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [pathParams.id],
    queryFn: () => getStudySet(pathParams.id as string),
  });
  useEffect(() => {
    if (!currentUser) router.push("/");
  }, [currentUser, router]);

  if (isLoading) return <div>loading</div>;
  if (isError) return <div>{error.message}</div>;
  if (currentUser?.uid === data?.creator)
    return (
      <>
        <SetEditor uid={currentUser!.uid} type={pathParams.id as string} />
      </>
    );
};

export default EditSetPage;
