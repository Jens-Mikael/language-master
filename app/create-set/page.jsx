"use client";
import InputField from "@/components/InputField";
import NewStudySetCard from "@/components/NewStudySetCard";
import QueryTest from "@/components/QueryTest";
import { useState } from "react";

const CreateSet = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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
          <QueryTest />
          <NewStudySetCard />
        </div>
      </div>
    </div>
  );
};

export default CreateSet;
