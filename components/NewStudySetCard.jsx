"use client";
import { useState } from "react";
import InputField from "./InputField";

const NewStudySetCard = ({ obj, setArr, index }) => {
  return (
    <div className="w-full bg-white/10 rounded-xl">
      {/* HEADER */}
      <div className="border-b-2 border-black/30 p-5">
        <div className="font-bold text-lg">{index + 1}</div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex gap-10 p-5 pt-10">
        {/* TERM */}
        <div className="grow">
          <InputField
            value={obj}
            setValue={setArr}
            type="term"
            index={index}
            label="TERM"
            placeholder="Enter something..."
          />
        </div>

        {/* DEF */}
        <div className="grow">
          <InputField
            value={obj}
            setValue={setArr}
            index={index}
            type="definition"
            label="DEFINITION"
            placeholder="Enter something..."
          />
        </div>
      </div>
    </div>
  );
};

export default NewStudySetCard;
