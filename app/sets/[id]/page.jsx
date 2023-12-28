"use client";
import { addTimestamp, getStudySet, setToCollection } from "@/firebase/hooks";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import SVG from "react-inlinesvg";
import Link from "next/link";
import { useAuth } from "@/firebase/context/AuthContext";

const LearnSetPage = () => {
  const pathname = useParams();
  const { currentUser } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: [pathname.id],
    queryFn: () => getStudySet(pathname.id),
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
            <Link
              href={`${pathname.id}/flashcards`}
              className="flex-1 flex gap-3 items-center rounded-xl bg-white/10 px-4 py-2 hover:scale-105 hover:bg-indigo-500/20 group transition cursor-pointer"
            >
              <SVG
                src="/icons/flashcards.svg"
                className="fill-blue-500 h-12 w-12 betterhover:group-hover:fill-indigo-500 transition"
                loader={<div className="h-12 w-12" />}
              />
              <div className="text-2xl font-bold">FlashCards</div>
            </Link>
            <Link
              href={`${pathname.id}/write`}
              className="flex-1 flex gap-3 items-center rounded-xl bg-white/10 px-4 py-1 hover:scale-105 hover:bg-indigo-500/20 group transition cursor-pointer"
            >
              <SVG
                src="/icons/write.svg"
                className="fill-blue-500 h-14 w-14 betterhover:group-hover:fill-indigo-500 transition"
                loader={<div className="h-14 w-14" />}
              />
              <div className="text-2xl font-bold">Write</div>
            </Link>
          </div>
          <div>
            <div>Your Learnings statistics</div>
          </div>
          <div>Created by</div>
          {/* EDIT SET */}
          <div className="flex flex-col gap-8">
            <div>Set content (32)</div>
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
            {data.creator === currentUser.uid && (
              <div className="flex justify-center">
                <Link
                  href={`/edit-set/${pathname.id}`}
                  className="rounded-xl sm:text-lg font-medium px-7 sm:px-10 py-3 sm:py-5 bg-blue-600 hover:bg-indigo-700 hover:scale-105 transition"
                >
                  Edit set
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnSetPage;
