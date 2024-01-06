"use client";
import SetEditor from "@components/SetEditor";
import { useAuth } from "@context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { IUseAuth } from "../../declarations";

const CreateSetPage = () => {
  const { currentUser, isLoading }: IUseAuth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser && !isLoading) {
      router.push("/");
    }
  }, [currentUser, router, isLoading]);
  if (currentUser)
    return (
      <>
        <SetEditor uid={currentUser.uid} type="studyDraft" />
      </>
    );
};

export default CreateSetPage;
