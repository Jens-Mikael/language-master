"use client";
import InputField from "@/components/InputField";
import NewStudySetCard from "@/components/NewStudySetCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  deleteStudySet,
  getStudyDraft,
  getStudySet,
  mutateStudyCardAmount,
  submitStudySet,
} from "@/firebase/hooks";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect } from "react";

const SetEditor = ({ uid, type }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: [type],
    queryFn: () =>
      type === "studyDraft" ? getStudyDraft(uid) : getStudySet(type),
  });
  const { mutateAsync: addStudyCard } = useMutation({
    mutationFn: () => mutateStudyCardAmount("add", null, data.id),
    onSuccess: () => {
      console.log(type);
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });
  const { mutateAsync: submitSet } = useMutation({
    mutationFn: () => submitStudySet(data.id, uid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });

  const { mutateAsync: deleteSet } = useMutation({
    mutationFn: () => deleteStudySet(type, uid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });

  if (isLoading) return <div>Loading</div>;
  const max = Math.max(...Object.keys(data.body));

  return (
    <div className="min-h-full flex justify-center pt-4">
      <div className="w-full max-w-5xl flex flex-col gap-20">
        {/* HEADER */}
        <div className="flex justify-between items-center gap-2">
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold">Create a new study set</div>
          </div>
          <button
            onClick={() => {
              if (data.head.title !== "") {
                if (type === "studyDraft") {
                  submitSet();
                  router.push("/");
                } else {
                  router.push(`/sets/${type}`);
                }
              }
            }}
            className="bg-blue-600 hover:bg-indigo-600 hover:scale-105 transition px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-md sm:text-lg font-medium"
          >
            {type === "studyDraft" ? "Create" : "Save"}
          </button>
        </div>

        {/* SET DETAILS */}
        <div className="w-full max-w-[512px] flex flex-col gap-6">
          <div>
            <InputField
              label="TITLE"
              placeholder="Enter a title..."
              id="editSetTitle"
              value={data.head.title}
              setId={data.id}
              type="title"
            />
          </div>
          <div>
            <InputField
              label="DESCRIPTION"
              placeholder="Add a description..."
              id="editSetDesc"
              value={data.head.description}
              setId={data.id}
              type="description"
            />
          </div>
        </div>

        {/* CARDS */}
        <div className="flex flex-col gap-10">
          {Object.keys(data.body).map((cardId, i) => (
            <AnimatePresence mode="popLayout" key={i}>
              <motion.div
                key={i}
                initial={{ opacity: 0.5, scale: 0.5, y: "20%" }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0.5, scale: 0.5 }}
              >
                <NewStudySetCard
                  obj={data.body[cardId]}
                  cardId={cardId}
                  index={i}
                  key={cardId}
                  setId={data.id}
                  type={type}
                />
              </motion.div>
            </AnimatePresence>
          ))}
          <button
            onClick={() => addStudyCard()}
            className="group w-full relative bg-white/10 rounded-xl flex items-center justify-center p-10 hover:scale-105 transition cursor-pointer"
          >
            <div className="border-b-4 border-blue-500 pb-2 font-bold text-xl group-hover:border-indigo-600 transition w-fit">
              + New Card
            </div>
            <div className="absolute left-10 font-bold text-xl">
              {Object.keys(data.body).length + 1}
            </div>
          </button>

          {type != "studyDraft" && (
            <div className="flex justify-end">
              <Link
                href="/"
                onClick={deleteSet}
                className="py-3 px-5 rounded-lg border border-white/40 bg-white/5 hover:bg-white/10 hover:scale-105 transition"
              >
                Delete Set
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetEditor;
