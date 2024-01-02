"use client";
import {
  addTimestamp,
  editPublicity,
  getStudySet,
  setToCollection,
} from "@/firebase/hooks";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SVG from "react-inlinesvg";
import Link from "next/link";
import { useAuth } from "@/firebase/context/AuthContext";
import MobileTap from "@/components/MobileTap";

const LearnSetPage = () => {
  const pathname = useParams();
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: [pathname.id],
    queryFn: () => getStudySet(pathname.id),
  });

  const { mutateAsync: mutatePublicity } = useMutation({
    mutationFn: (isPublic) => editPublicity(pathname.id, isPublic),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [pathname.id] });
    },
  });

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>error</div>;
  return (
    <div className="flex justify-center gap-10">
      <div className="max-w-5xl w-full">
        <div className="flex flex-col gap-14">
          <div className="text-3xl sm:text-4xl font-bold">
            {data.head.title}
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
              {data.creator === currentUser?.uid && (
                <div>
                  <label className=" relative inline-flex cursor-pointer select-none items-center">
                    <input
                      type="checkbox"
                      name="autoSaver"
                      className="sr-only peer"
                      defaultChecked={data.isPublic}
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
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {Object.keys(data.body).map((key, i) => (
                <div
                  key={key}
                  className="flex bg-white/[0.15] rounded-lg text-lg "
                >
                  <div className="py-5 px-8 flex justify-center items-center min-w-[84px]">
                    {i + 1}
                  </div>
                  <div className="border-r-2 border-black/40" />
                  <div className="font-medium flex flex-col sm:flex-row flex-1 gap-3 p-5">
                    <div className="flex-1">{data.body[key].term}</div>
                    <div className="sm:w-0.5 w-full h-0.5 sm:h-full bg-black/40" />
                    <div className="flex-1">{data.body[key].definition}</div>
                  </div>
                </div>
              ))}
            </div>
            {data.creator === currentUser?.uid && (
              <div className="flex justify-center">
                <MobileTap>
                  <Link
                    href={`/edit-set/${pathname.id}`}
                    className="rounded-xl sm:text-lg font-medium px-7 sm:px-10 py-3 sm:py-5 bg-blue-600 hover:bg-indigo-700 hover:scale-105 transition"
                  >
                    Edit set
                  </Link>
                </MobileTap>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnSetPage;
