"use client";
import SetEditor from "@/components/SetEditor";
import { useAuth } from "@/firebase/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CreateSetPage = () => {
  const { currentUser, isLoading } = useAuth();
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
