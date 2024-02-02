"use client";
import MobileTap from "@components/MobileTap";
import { useAuth } from "@context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { IUseAuth } from "../../../utils/declarations";
import Loader from "@components/Loader";

const DefaultUserPage = () => {
  const { currentUser, isLoading, logout, deleteAccount }: IUseAuth = useAuth();
  const router = useRouter();
  const pathParams = useParams();

  useEffect(() => {
    if (!isLoading) {
      if (currentUser?.uid !== pathParams.uid || !currentUser)
        router.push(`/users/${pathParams.uid}/studySets`);
    }
  }, [isLoading, currentUser, pathParams]);

  if (isLoading) return <Loader />;
  if (currentUser?.uid !== pathParams.uid || !currentUser)
    return <Loader />;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          Account Created:{" "}
          <div className="font-medium italic">
            {currentUser.metadata.creationTime}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          Last log in:{" "}
          <div className="font-medium italic">
            {currentUser.metadata.lastSignInTime}
          </div>
        </div>
      </div>
      <div className="border-b border-white/20 w-full" />
      <div className="flex gap-5">
        <MobileTap
          className="border border-white/20 px-2 py-1 rounded-lg w-fit"
          onClick={() => {
            router.push(`/users/${pathParams.uid}/studySets`);
            if (logout) logout();
          }}
        >
          Log Out
        </MobileTap>
        <MobileTap
          className="border border-red-600/80 text-red-600/80 px-2 py-1 rounded-lg w-fit"
          onClick={() => {
            if (deleteAccount) deleteAccount();
            router.push(`/`);
          }}
        >
          Delete Account
        </MobileTap>
      </div>
    </div>
  );
};

export default DefaultUserPage;
