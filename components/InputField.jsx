"use client";

import { mutateStudySet } from "@/firebase/hooks";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";

const InputField = ({ label, placeholder, value, setValue, type, index }) => {
  const [focus, setFocus] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: editStudyDraft } = useMutation(
    mutateStudySet(type, index, value),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("studyDraft");
      },
    }
  );

  return (
    <div className="gap-1.5 flex flex-col">
      <div>
        <textarea
          className="max-h-40 scrollbar-none resize-none bg-transparent w-full ring-none outline-none font-light"
          rows="1"
          placeholder={placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => {
            setFocus(false);
          }}
          value={value}
          onChange={(e) => {
            const textarea = e.target;
            textarea.style.height = "auto";
            const scrollHeight = textarea.scrollHeight;
            textarea.style.height = `${scrollHeight}px`;
            //if studycard arr
            if (type) {
              setValue((prev) => {
                prev[index][type] = textarea.value;
                return prev;
              });
            } // if default input
            else {
              setValue(textarea.value);
            }
          }}
        />
        <div className="h-1">
          <div
            className={`${
              focus ? "h-1 bg-white" : "h-0.5 bg-white/100"
            }  transition-all`}
          />
        </div>
      </div>
      <div className="text-xs">{label}</div>
    </div>
  );
};

export default InputField;
