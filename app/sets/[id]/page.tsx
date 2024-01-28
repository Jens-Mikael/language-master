"use client";
import { editPublicity, getStudySet } from "@firebase/hooks";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SVG from "react-inlinesvg";
import Link from "next/link";
import { useAuth } from "@context/AuthContext";
import MobileTap from "@components/MobileTap";
import { IUseAuth } from "../../../utils/declarations";
import { useEffect, useState } from "react";
import SetSettings from "@components/SetSettings";

const LearnSetPage = () => {
  const pathname = useParams();
  const router = useRouter();
  const { currentUser }: IUseAuth = useAuth();
  const { data, isLoading, error, isError } = useQuery({
    queryKey: [pathname.id],
    queryFn: () => getStudySet(pathname.id as string),
  });

  useEffect(() => {
    if (!isLoading && !data && !isError) router.push("/");
  }, [data, isLoading]);

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>{error.message}</div>;
  if (!data) return <div>loading...</div>;
  return (
    <div className="flex justify-center gap-10">
      {/* SUBMIT BOX */}
      {/* {data?.creator === currentUser?.uid && (
        <SubmitBox
          title={data?.head.title}
          isSubmitOpen={isSubmitOpen}
          setIsSubmitOpen={setIsSubmitOpen}
          action="archive"
        />
      )} */}

      <div className="max-w-5xl w-full">
        <div className="flex flex-col gap-14">
          <div className="text-3xl sm:text-4xl font-bold">
            {data?.head.title}
          </div>
          <div className="flex gap-5 flex-col md:flex-row">
            <MobileTap className="flex-1">
              <Link
                href={`${pathname.id}/flashcards`}
                className="w-full flex gap-3 items-center rounded-xl bg-white/10 px-4 py-2 hover:scale-105 hover:bg-indigo-500/20 group transition cursor-pointer"
              >
                <SVG
                  src="/icons/flashcards.svg"
                  className="fill-blue-500 h-12 w-12 betterhover:group-hover:fill-indigo-500 transition"
                  loader={<div className="h-12 w-12" />}
                />
                <div className="text-2xl font-bold">FlashCards</div>
              </Link>
            </MobileTap>
            <MobileTap className="flex-1">
              <Link
                href={`${pathname.id}/write`}
                className="w-full flex gap-3 items-center rounded-xl bg-white/10 px-4 py-1 hover:scale-105 hover:bg-indigo-500/20 group transition cursor-pointer"
              >
                <SVG
                  src="/icons/write.svg"
                  className="fill-blue-500 h-14 w-14 betterhover:group-hover:fill-indigo-500 transition"
                  loader={<div className="h-14 w-14" />}
                />
                <div className="text-2xl font-bold">Write</div>
              </Link>
            </MobileTap>
          </div>
          <div>
            <div>Your Learnings statistics</div>
          </div>
          <div>Created by</div>
          {/* EDIT SET */}
          <div className="flex flex-col gap-8">
            <div className="flex justify-between sm:flex-row flex-col gap-5">
              <div>Set content (32)</div>
              <div className="self-end">
              {data?.creator === currentUser?.uid && (
                <SetSettings
                  setId={pathname.id as string}
                  title={data.head.title}
                  isPublic={data.isPublic}
                />
              )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {Object.keys(data!.body).map((key, i) => (
                <div
                  key={key}
                  className="flex bg-white/[0.15] rounded-lg text-lg "
                >
                  <div className="py-5 px-8 flex justify-center items-center min-w-[84px]">
                    {i + 1}
                  </div>
                  <div className="border-r-2 border-black/40" />
                  <div className="font-medium flex flex-col sm:flex-row flex-1 gap-3 p-5">
                    <div className="flex-1">{data?.body[key].term}</div>
                    <div className="sm:w-0.5 w-full h-0.5 sm:h-full bg-black/40" />
                    <div className="flex-1">{data?.body[key].definition}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnSetPage;
