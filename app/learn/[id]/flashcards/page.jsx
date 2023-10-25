"use client";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";
import { getStudySet } from "@/firebase/hooks";
import SVG from "react-inlinesvg";

const LearnFlashcards = () => {
  const pathname = useParams();
  const { data, isLoading } = useQuery(pathname.id, () =>
    getStudySet(pathname.id)
  );
  console.log(data);
  if (isLoading) return <div className="">loading...</div>;
  return (
    <div className="h-full items-center flex justify-center">
      <div className="flex flex-col gap-5 h-full max-w-5xl w-full py-5">
        <button className="flex items-center justify-center text-4xl font-light grow w-full bg-white/20 rounded-lg shadow-[0px_0px_12px_0px_rgba(255,255,255,0.75)] shadow-white/20">
          haben
        </button>
        <div className="flex justify-between">
          <button className="hover:bg-white/10 transition rounded-full p-2 h-min">
            <SVG
              src="/icons/undo.svg"
              className="h-7 w-7 fill-white"
              loader={<div className="h-7 w-7" />}
            />
          </button>
          <div className="flex gap-10">
            <button className="p-2 border-2 border-white/20 hover:bg-white/10 transition rounded-full">
              <SVG
                src="/icons/remove.svg"
                className="h-8 w-8 fill-red-500"
                loader={<div className="h-8 w-8" />}
              />
            </button>
            <button className="p-2 border-2 border-white/20 hover:bg-white/10 transition rounded-full">
              <SVG
                src="/icons/done.svg"
                className="h-8 w-8 fill-green-500"
                loader={<div className="h-8 w-8" />}
              />
            </button>
          </div>
          <button className="border-2 border-white/20 hover:bg-white/10 h-min p-2 rounded-full">
            <SVG
              src="/icons/shuffle.svg"
              className="h-7 w-7 fill-white"
              loader={<div className="h-7 w-7" />}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearnFlashcards;
