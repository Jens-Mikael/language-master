"use client";
import InputField from "@/components/InputField";
import NewStudySetCard from "@/components/NewStudySetCard";
import { getStudyDraft, mutateStudyCardAmount } from "@/firebase/hooks";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useState } from "react";

const CreateSet = ({ uid }) => {
  const { data, isLoading, isError, error } = useQuery("studyDraft", () =>
    getStudyDraft(uid)
  );
  const queryClient = useQueryClient();
  const { mutateAsync: addStudyCard } = useMutation(
    () => mutateStudyCardAmount("add", max <= 0 ? 1 : max + 1, data.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("studyDraft");
      },
    }
  );

  if (isLoading) return <div>Loading</div>;
  const max = Math.max(...Object.keys(data.data.body));

  return (
    <div className="min-h-full flex justify-center px-10 py-14">
      <div className="w-full max-w-5xl flex flex-col gap-20">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold">Create a new study set</div>
            <div className="text-sm">Saving...</div>
          </div>
          <button className="bg-blue-600 hover:bg-indigo-600 hover:scale-105 transition px-3 py-2 rounded-lg">
            Create
          </button>
        </div>

        {/* SET DETAILS */}
        <div className="w-full max-w-[512px] flex flex-col gap-6">
          <div>
            <InputField
              label="TITLE"
              placeholder="Enter a title..."
              id="createSetTitle"
              value={data.data.head.title}
              studySetId={data.id}
              type="title"
            />
          </div>
          <div>
            <InputField
              label="DESCRIPTION"
              placeholder="Add a description..."
              id="createSetDesc"
              value={data.data.head.description}
              studySetId={data.id}
              type="description"
            />
          </div>
        </div>

        {/* CARDS */}
        <div className="flex flex-col gap-10">
          {Object.keys(data.data.body).map((key, i) => (
            <NewStudySetCard
              obj={data.data.body[key]}
              dbIndex={key}
              index={i}
              key={i}
              studySetId={data.id}
            />
          ))}
          <button
            onClick={() => addStudyCard()}
            className="group w-full relative bg-white/10 rounded-xl flex items-center justify-center p-10 hover:scale-105 transition cursor-pointer"
          >
            <div className="border-b-4 border-blue-500 pb-2 font-bold text-xl group-hover:border-indigo-600 transition">
              + New Card
            </div>
            <div className="absolute left-10 font-bold text-xl">
              {Object.keys(data.data.body).length + 1}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSet;
