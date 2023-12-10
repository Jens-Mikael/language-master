"use client";
import SetEditor from "@/components/SetEditor";
import { useAuth } from "@/firebase/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

const EditSetPage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const pathParams = useParams();
  const { data, isLoading } = useQuery({
    queryKey: [pathParams.id],
    queryFn: () => getStudySet([pathParams.id]),
  });
  useEffect(() => {
    if (!currentUser) router.push("/");
  }, [currentUser, router]);

  if (isLoading) return <div>loading</div>;
  if (currentUser.uid === data.creator)
    return (
      <>
        <SetEditor uid={currentUser.uid} type={pathParams.id} />
      </>
    );
};

export default EditSetPage;
