"use client";
import InputField from "@components/InputField";
import NewStudySetCard from "@components/NewStudySetCard";
import PropagateLoader from "react-spinners/PropagateLoader";

import SVG from "react-inlinesvg";
import { motion, AnimatePresence } from "framer-motion";
import {
  deleteStudySet,
  getStudyDraft,
  getStudySet,
  mutateStudyCardAmount,
  submitStudySet,
} from "@firebase/hooks";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import MobileTap from "./MobileTap";
import { IStudySet } from "../utils/declarations";
import { writeArchiveSet } from "@firebase/hooks/write";
import { useState } from "react";

interface IProps {
  uid: string;
  type: string;
}

const SetEditor = ({ uid, type }: IProps) => {
  const [isSubmitOpen, setIsSubmitOpen] = useState<boolean>(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, error, isError } = useQuery<IStudySet>({
    queryKey: [type],
    queryFn: (): Promise<IStudySet> =>
      type === "studyDraft" ? getStudyDraft(uid) : getStudySet(type),
  });
  const { mutateAsync: addStudyCard } = useMutation({
    mutationFn: () => mutateStudyCardAmount("add", null, data?.id!),
    onSuccess: () => {
      console.log(type);
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });
  const { mutateAsync: submitSet } = useMutation({
    mutationFn: () => submitStudySet(data?.id!, uid),
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

  const { mutateAsync: setArchieve, isPending: isArchivePending } = useMutation(
    {
      mutationFn: (archive: boolean) => writeArchiveSet(type, archive),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [type] });
      },
    }
  );

  if (isLoading) return <div>Loading</div>;
  if (isError) {
    console.log(error);
    return <div>{error.message}</div>;
  }

  return (
    <div className="min-h-full flex justify-center items-center pt-4">
      {/* SUBMIT BOX */}
      <div
        className={`${
          isSubmitOpen ? "translate-y-0" : "-translate-y-full"
        } fixed inset-0 flex z-20 transition-transform duration-300`}
      >
        <div className="relative flex-1 flex items-center justify-center">
          <div className="z-20 bg-[#0A092D] border border-white/50 rounded-xl w-1/3 h-[350px] p-8 flex items-center flex-col justify-center gap-10">
            {false ? (
              <>
                <div className="text-3xl ">
                  Are you sure you want to Archive <i>{data?.head.title}</i> ?
                </div>
                <MobileTap className="bg-blue-500 hover:bg-indigo-600 text-lg font-bold transition rounded-lg px-7 py-4">
                  Submit
                </MobileTap>
              </>
            ) : (
              <PropagateLoader color="#ffffff" />
            )}
          </div>
          <div
            className="absolute inset-0"
            onClick={() => setIsSubmitOpen(false)}
          />
        </div>
      </div>
      <div className="w-full max-w-5xl flex flex-col gap-20">
        {/* HEADER */}
        <div className="flex justify-between items-center gap-2">
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold">
              {type === "studyDraft" ? "Create a new study set" : "Edit set:"}
            </div>
          </div>
          <MobileTap
            onClick={() => {
              if (data?.head.title !== "") {
                if (type === "studyDraft") {
                  if (data) submitSet();
                  router.push("/");
                } else {
                  router.push(`/sets/${type}`);
                }
              }
            }}
            className="bg-blue-600 hover:bg-indigo-600 hover:scale-105 transition px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-md sm:text-lg font-medium"
          >
            {type === "studyDraft" ? "Create" : "Save"}
          </MobileTap>
        </div>

        {/* SET DETAILS */}
        <div className="w-full max-w-[512px] flex flex-col gap-6">
          <div>
            <InputField
              label="TITLE"
              placeholder="Enter a title..."
              cardId="editSetTitle"
              value={data?.head.title!}
              setId={data?.id!}
              type="title"
            />
          </div>
          <div>
            <InputField
              label="DESCRIPTION"
              placeholder="Add a description..."
              cardId="editSetDesc"
              value={data?.head.description!}
              setId={data?.id!}
              type="description"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <MobileTap
            className="border-2 border-white rounded-full p-2 hover:bg-white/20 transition"
            onClick={() => setIsSubmitOpen(true)}
          >
            <SVG
              className="h-6 w-6 fill-white"
              src="/icons/archive.svg"
              loader={<div className="h-6 w-6" />}
            />
          </MobileTap>
        </div>

        {/* CARDS */}
        <div className="flex flex-col gap-10">
          {Object.keys(data!.body).map((cardId, i) => (
            <AnimatePresence mode="popLayout" key={i}>
              <motion.div
                key={i}
                initial={{ opacity: 0.5, scale: 0.5, y: "20%" }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0.5, scale: 0.5 }}
              >
                <NewStudySetCard
                  obj={data!.body[cardId]}
                  cardId={cardId}
                  index={i}
                  key={cardId}
                  setId={data!.id}
                  type={type}
                />
              </motion.div>
            </AnimatePresence>
          ))}
          <MobileTap
            onClick={() => addStudyCard()}
            className="group w-full relative bg-white/10 rounded-xl flex items-center justify-center p-10 hover:scale-105 transition cursor-pointer"
          >
            <div className="border-b-4 border-blue-500 pb-2 font-bold text-xl group-hover:border-indigo-600 transition w-fit">
              + New Card
            </div>
            <div className="absolute left-10 font-bold text-xl">
              {Object.keys(data!.body).length + 1}
            </div>
          </MobileTap>

          {type != "studyDraft" && (
            <div className="flex justify-end">
              <MobileTap>
                <Link
                  href="/"
                  onClick={() => deleteSet()}
                  className="py-3 px-5 rounded-lg border border-white/40 bg-white/5 hover:bg-white/10 hover:scale-105 transition"
                >
                  Delete Set
                </Link>
              </MobileTap>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetEditor;
