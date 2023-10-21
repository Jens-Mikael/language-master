"use client";
import CreateSet from "@/components/CreateSet";
import { useAuth } from "@/firebase/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CreateSetPage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
    }
  }, []);
  if (currentUser)
    return (
      <>
        <CreateSet uid={currentUser.uid} />
      </>
    );
};

export default CreateSetPage;
