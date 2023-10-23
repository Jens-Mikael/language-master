"use client";

import { mutateStudySet } from "@/firebase/hooks";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";

const InputField = ({
  label,
  placeholder,
  type,
  value,
  dbIndex,
  studySetId,
}) => {
  const [focus, setFocus] = useState(false);
  const [input, setInput] = useState(value);
  const queryClient = useQueryClient();

  const { mutate: mutateStudyDraft } = useMutation(
    (input) => mutateStudySet(type, dbIndex, input, studySetId),
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
          onBlur={(e) => {
            setFocus(false);
            mutateStudyDraft(e.target.value);
          }}
          value={input}
          onChange={(e) => {
            const textarea = e.target;
            textarea.style.height = "auto";
            const scrollHeight = textarea.scrollHeight;
            textarea.style.height = `${scrollHeight}px`;
            setInput(textarea.value);
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
