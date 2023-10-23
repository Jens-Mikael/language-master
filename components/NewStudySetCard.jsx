"use client";
import { useState } from "react";
import InputField from "./InputField";
import SVG from "react-inlinesvg";
import { useMutation, useQueryClient } from "react-query";
import { mutateStudyCardAmount } from "@/firebase/hooks";

const NewStudySetCard = ({ obj, dbIndex, index, studySetId }) => {
  const queryClient = useQueryClient();

  const { mutateAsync: removeCard } = useMutation(
    "studyDraft",
    () => mutateStudyCardAmount("remove", dbIndex, studySetId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("studyDraft");
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );

  return (
    <div className="w-full bg-white/10 rounded-xl">
      {/* HEADER */}
      <div className="border-b-2 border-black/30 p-5 flex justify-between">
        <div className="font-bold text-lg">{index + 1}</div>
        <button onClick={() => removeCard()} className="hover:scale-110 group">
          <SVG
            src="icons/trash.svg"
            className="h-6 w-6 fill-white group-hover:fill-indigo-500 transition"
            loader={<div className="h-6 w-6" />}
          />
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex gap-10 p-5 pt-10">
        {/* TERM */}
        <div className="grow">
          <InputField
            value={obj.term}
            type="term"
            dbIndex={dbIndex}
            label="TERM"
            placeholder="Enter something..."
            studySetId={studySetId}
          />
        </div>

        {/* DEF */}
        <div className="grow">
          <InputField
            value={obj.definition}
            dbIndex={dbIndex}
            type="definition"
            label="DEFINITION"
            placeholder="Enter something..."
            studySetId={studySetId}
          />
        </div>
      </div>
    </div>
  );
};

export default NewStudySetCard;
