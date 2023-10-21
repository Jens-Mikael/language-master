"use client";
import InputField from "@/components/InputField";
import NewStudySetCard from "@/components/NewStudySetCard";
import { getStudyDraft } from "@/firebase/hooks";
import { useQuery } from "react-query";
import { useState } from "react";

const CreateSet = ({ uid }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [studyArr, setStudyArr] = useState([
    {
      term: "",
      definition: "",
    },
    {
      term: "",
      definition: "",
    },
  ]);

  const { data, isLoading, isError, error } = useQuery("studyDraft", () =>
    getStudyDraft(uid)
  );

  return (
    <div className="min-h-full flex justify-center px-10 py-14">
      <div className="w-full max-w-5xl flex flex-col gap-20">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold">Create a new study set</div>
            <div className="text-sm">Saving...</div>
          </div>
          <div>Create</div>
        </div>

        {/* SET DETAILS */}
        <div className="w-full max-w-[512px] flex flex-col gap-6">
          <div>
            <InputField
              label="TITLE"
              placeholder="Enter a title..."
              id="createSetTitle"
              value={title}
              setValue={setTitle}
            />
          </div>
          <div>
            <InputField
              label="DESCRIPTION"
              placeholder="Add a description..."
              id="createSetDesc"
              value={description}
              setValue={setDescription}
            />
          </div>
        </div>

        {/* CARDS */}
        <div className="flex flex-col gap-10">
          {studyArr.map((obj, i) => (
            <NewStudySetCard
              obj={obj[i]}
              setArr={setStudyArr}
              index={i}
              key={i}
            />
          ))}
          <div
            onClick={() =>
              setStudyArr((prev) => [...prev, { term: "", definition: "" }])
            }
            className="w-full relative bg-white/10 rounded-xl flex items-center justify-center p-10 hover:scale-105 transition cursor-pointer"
          >
            <div className="border-b-4 border-sky-400 pb-2 font-bold text-xl ">
              + New Card
            </div>
            <div className="absolute left-10 font-bold text-xl">
              {studyArr.length + 1}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSet;
