"use client";
import MobileTap from "@components/MobileTap";
import SVG from "react-inlinesvg";
import { useAuth } from "@context/AuthContext";
import { getUserArchive } from "@firebase/hooks/read";
import { useQuery } from "@tanstack/react-query";
import { IUseAuth } from "@utils/declarations";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SubmitBox from "@components/SubmitBox";

const ArchivePage = () => {
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [selectedSet, setSelectedSet] = useState("");
  const { currentUser, isLoading: userLoading }: IUseAuth = useAuth();
  const router = useRouter();
  const pathParams = useParams();
  const {
    data,
    error,
    isLoading: queryLoading,
    isError,
  } = useQuery({
    queryKey: ["userArchive", { user: pathParams.uid }],
    queryFn: () => getUserArchive(pathParams.uid as string, 20),
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
  if (isError) return <div>{error.message}</div>;
  return (
    <>
      <div className="flex flex-col gap-5">
        {data?.length === 0 ? (
          <div>You have no archived study sets</div>
        ) : (
          data?.map((obj) => (
            <div>
              <div
                key={obj.id}
                className="px-8 py-4 rounded-xl w-full bg-white/20 hover:scale-[1.02] transition flex justify-between text-start items-center"
              >
                <div className=" flex flex-col gap-2">
                  <div className="text-lg font-medium">{obj.title}</div>
                  <div className="text-sm italic font-medium">
                    {obj.description}
                  </div>
                </div>
                <MobileTap
                  onClick={() => {
                    setIsSubmitOpen(true);
                    setSelectedSet(obj.id);
                  }}
                  className="p-2 rounded-full border-2 border-white hover:bg-white/20"
                >
                  <SVG
                    className="h-7 w-7 fill-white"
                    src="/icons/unarchive.svg"
                    loader={<div className="h-7 w-7" />}
                  />
                </MobileTap>
              </div>
            </div>
          ))
        )}
      </div>
      <SubmitBox
        isSubmitOpen={isSubmitOpen}
        setIsSubmitOpen={setIsSubmitOpen}
        setId={selectedSet}
        action="unArchive"
      />
    </>
  );
};

export default ArchivePage;
