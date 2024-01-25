"use client";
import { editPublicity, getStudySet } from "@firebase/hooks";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SVG from "react-inlinesvg";
import Link from "next/link";
import { useAuth } from "@context/AuthContext";
import MobileTap from "@components/MobileTap";
import { IUseAuth } from "../../../utils/declarations";
import { useState } from "react";
import SubmitBox from "@components/SubmitBox";

const LearnSetPage = () => {
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const pathname = useParams();
  const queryClient = useQueryClient();
  const { currentUser }: IUseAuth = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: [pathname.id],
    queryFn: () => getStudySet(pathname.id as string),
  });

  const { mutateAsync: mutatePublicity } = useMutation({
    mutationFn: (isPublic: boolean) =>
      editPublicity(pathname.id as string, isPublic),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [pathname.id] });
    },
  });

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>error</div>;
  return (
    <div className="flex justify-center gap-10">
      {/* SUBMIT BOX */}
      {data?.creator === currentUser?.uid && (
        <SubmitBox
          title={data?.head.title}
          isSubmitOpen={isSubmitOpen}
          setIsSubmitOpen={setIsSubmitOpen}
          action="archive"
        />
      )}

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
            <div className="flex justify-between">
              <div>Set content (32)</div>
              {data?.creator === currentUser?.uid && (
                <div className="flex gap-5 items-center">
                  <div>
                    <label className="relative inline-flex cursor-pointer select-none items-center gap-2 w-[108px] h-10">
                      <input
                        type="checkbox"
                        name="autoSaver"
                        className="sr-only peer"
                        defaultChecked={data?.isPublic}
                        onChange={(e) => mutatePublicity(e.target.checked)}
                      />
                      <div
                        className={`h-full w-full items-center rounded-full duration-200 peer-checked:bg-indigo-600 bg-red-600 absolute`}
                      />
                      <SVG
                        className="h-5 w-5 z-10 fill-white peer-checked:hidden ml-3"
                        src="/icons/lock-closed.svg"
                        loader={<div className="h-5 w-5 ml-2" />}
                      />
                      <SVG
                        className="h-5 w-5 z-10 fill-white peer-checked:block hidden ml-3"
                        src="/icons/lock-open.svg"
                        loader={<div className="h-5 w-5 ml-2" />}
                      />

                      <div className="pointer-events-none peer-checked:hidden font-medium z-10">
                        Private
                      </div>
                      <div className="pointer-events-none peer-checked:block hidden font-medium z-10">
                        Public
                      </div>
                    </label>
                  </div>
                  <Link
                    href={`/edit-set/${pathname.id}`}
                    className="transition border-2 border-white hover:bg-white/20 rounded-full p-2 cursor-pointer"
                  >
                    <SVG
                      src="/icons/edit.svg"
                      className="h-6 w-6 fill-white "
                      loader={<div className="h-6 w-6" />}
                    />
                  </Link>
                  <MobileTap
                    className="border-2 border-white rounded-full p-2 hover:bg-white/20 transition"
                    onClick={() => setIsSubmitOpen(true)}
                  >
                    <SVG
                      className="h-6 w-6 fill-white"
                      src="/icons/archive.svg"
                      loader={<div className="h-6 w-6" />}
                    />
                  </MobileTap>

                  {/* <div>
                    <label className=" relative inline-flex cursor-pointer select-none items-center">
                      <input
                        type="checkbox"
                        name="autoSaver"
                        className="sr-only peer"
                        defaultChecked={data?.isPublic}
                        onChange={(e) => mutatePublicity(e.target.checked)}
                      />
                      <div
                        className={`h-7 w-14 items-center rounded-full duration-200 peer-checked:bg-indigo-600 bg-red-600`}
                      />
                      <div
                        className={`absolute left-1.5 h-5 w-5 rounded-full bg-white duration-200 peer-checked:translate-x-6 `}
                      />
                      <div className="pointer-events-none absolute peer-checked:hidden bottom-full mb-2">
                        Private
                      </div>
                      <div className="pointer-events-none absolute peer-checked:block hidden bottom-full mb-2">
                        Public
                      </div>
                    </label>
                  </div> */}
                </div>
              )}
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
