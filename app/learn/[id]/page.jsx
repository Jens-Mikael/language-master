"use client";
import { getStudySet } from "@/firebase/hooks";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";
import SVG from "react-inlinesvg";
import Link from "next/link";

const LearnSetPage = () => {
  const pathname = useParams();
  const { data, isLoading } = useQuery(pathname.id, () =>
    getStudySet(pathname.id)
  );
  console.log(data);
  if (isLoading) return <div>loading...</div>;
  return (
    <div className="flex justify-center gap-10">
      <div className="max-w-5xl w-full py-5">
        <div className="flex flex-col gap-5">
          <div className="text-4xl font-bold">{data.head.title}</div>
          <div className="flex gap-5">
            <Link
              href={`${pathname.id}/flashcards`}
              className="flex-1 flex gap-3 items-center rounded-xl bg-white/10 px-4 py-2 hover:scale-105 hover:bg-indigo-500/20 group transition cursor-pointer"
            >
              <SVG
                src="/icons/flashcards.svg"
                className="fill-blue-500 h-12 w-12 group-hover:fill-indigo-500 transition"
                loader={<div className="h-12 w-12" />}
              />
              <div className="text-2xl font-bold">FlashCards</div>
            </Link>
            <Link
              href={`${pathname.id}/write`}
              className="flex-1 flex gap-3 items-center rounded-xl bg-white/10 px-4 py-2 hover:scale-105 hover:bg-indigo-500/20 group transition cursor-pointer"
            >
              <SVG
                src="/icons/write.svg"
                className="fill-blue-500 h-14 w-14 group-hover:fill-indigo-500 transition"
                loader={<div className="h-14 w-14" />}
              />
              <div className="text-2xl font-bold">Write</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnSetPage;
