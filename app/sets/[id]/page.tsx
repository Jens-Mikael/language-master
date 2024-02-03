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
import Loader from "@components/Loader";
import { getUserInfo } from "@firebase/hooks/read";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";

const LearnSetPage = () => {
  const pathParams = useParams();
  const router = useRouter();
  const { currentUser }: IUseAuth = useAuth();
  const { data, isLoading, error, isError } = useQuery({
    queryKey: [pathParams.id],
    queryFn: () => getStudySet(pathParams.id as string),
  });
  const {
    data: userData,
    isLoading: userIsLoading,
    isError: userIsError,
    error: userError,
  } = useQuery({
    queryKey: [data?.creator],
    queryFn: () => getUserInfo(data?.creator as string),
  });

  useEffect(() => {
    if (!isLoading && !data && !isError) router.push("/");
  }, [data, isLoading]);

  if (isLoading) return <Loader />;
  if (isError) return <div>{error.message}</div>;
  if (!data) return <Loader />;
  return (
    <div className="flex justify-center gap-10 flex-1">
      <div className="max-w-5xl w-full">
        <div className="flex flex-col gap-14">
          <div className="text-3xl sm:text-4xl font-bold">
            {data?.head.title}
          </div>
          <div className="flex gap-5 flex-col md:flex-row">
            <MobileTap className="flex-1">
              <Link
                href={`${pathParams.id}/flashcards`}
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
                href={`${pathParams.id}/write`}
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
          <div className="flex flex-col gap-5">
            <div className="font-medium text-lg">Created by</div>
            <div className="flex gap-5">
              <div className=" min-h-[60px] max-h-[60px] sm:h-[72px] sm:max-h-full max-w-[60px] min-w-[60px] sm:w-[72px] sm:max-w-full">
                {userData ? (
                  <Image
                    className="rounded-full"
                    src={userData!.photoURL}
                    alt="pfp"
                    width={72}
                    height={72}
                  />
                ) : (
                  <Skeleton circle className="h-full w-full rounded-full" />
                )}
              </div>
              <div className="flex flex-col gap-2 w-full max-w-[300px]">
                <div className="font-bold text-xl sm:text-2xl w-full">
                  {userData ? (
                    userData?.displayName
                  ) : (
                    <Skeleton className=" h-10" />
                  )}
                </div>
                <p className="italic text-sm text-white/70 w-full">
                  {userData ? userData?.email : <Skeleton />}
                </p>
              </div>
            </div>
          </div>
          {/* EDIT SET */}
          <div className="flex flex-col gap-8">
            <div className="flex justify-between sm:flex-row flex-col gap-5">
              <div className="font-medium text-lg">
                Set content ({Object.keys(data?.body).length})
              </div>
              <div className="self-end">
                {data?.creator === currentUser?.uid && (
                  <SetSettings
                    setId={pathParams.id as string}
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
