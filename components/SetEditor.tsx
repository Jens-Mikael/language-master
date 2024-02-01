"use client";
import InputField from "@components/InputField";
import NewStudySetCard from "@components/NewStudySetCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  getStudyDraft,
  getStudySet,
  mutateStudyCardAmount,
  submitStudySet,
} from "@firebase/hooks";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MobileTap from "./MobileTap";
import SetSettings from "./SetSettings";
import Loader from "./Loader";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";

interface IProps {
  uid: string;
  type: string;
}

const SetEditor = ({ uid, type }: IProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [cardLoaders, setCardLoaders] = useState<string[]>([]);
  const [removedCards, setRemovedCards] = useState<string[]>([]);

  const { data, isLoading, error, isError } = useQuery({
    queryKey: [type],
    queryFn: async () => {
      const data =
        type === "studyDraft"
          ? await getStudyDraft(uid)
          : await getStudySet(type);
      const body = Object.keys(data!.body);
      //filter cardLoaders

      setCardLoaders((prev) => prev.filter((id) => !body.includes(id)));
      //filter removedCards
      setRemovedCards((prev) => prev.filter((id) => body.includes(id)));
      return data;
    },
  });
  const { mutateAsync: editStudyCardAmount } = useMutation({
    mutationFn: async ({
      action,
      cardId,
    }: {
      action: string;
      cardId?: string;
    }) => {
      const res = await mutateStudyCardAmount(
        action,
        action === "add" ? null : cardId!,
        data?.id!
      );
      if (res) setCardLoaders((prev) => [...prev, res.id]);
    },

    onMutate: ({ action, cardId }) => {
      if (action === "remove" && cardId)
        return setRemovedCards((prev) => [...prev, cardId]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });

  const { mutateAsync: submitSet } = useMutation({
    mutationFn: () => submitStudySet(data?.id!, uid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });

  if (isLoading) return <Loader />;
  if (isError) {
    console.log(error);
    return <div>{error.message}</div>;
  }
  console.log(removedCards, cardLoaders);
  return (
    <div className="min-h-full w-full flex justify-center items-center pt-4">
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
        {type !== "studyDraft" && (
          <div className="flex justify-end">
            <SetSettings
              setId={type}
              title={data?.head.title!}
              isPublic={data?.isPublic!}
            />
          </div>
        )}

        {/* CARDS */}
        <div className="flex flex-col gap-10">
          <AnimatePresence  mode="popLayout">
            {[...Object.keys(data!.body), ...cardLoaders].map((cardId, i) => {
              if (removedCards.includes(cardId as string)) return;
              return (
                <motion.div
                  key={cardId}
                  layout
                  initial={{ opacity: 0.5, scale: 0.5, y: "20%" }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  {!Object.keys(data!.body).includes(cardId) ? (
                    <div className="w-full bg-white/10 rounded-xl ">
                      <div className="flex justify-between p-5 border-b-2 border-black/30">
                        <div className="h-10 w-10">
                          <Skeleton className=" h-10 w-10" />
                        </div>
                        <div className="h-10 w-10">
                          <Skeleton className=" h-10 w-10" />
                        </div>
                      </div>
                      <div className="flex sm:flex-row flex-col px-5 pt-9 pb-7 gap-8">
                        <div className="flex-1">
                          <Skeleton className="flex-1 h-10" />
                        </div>
                        <div className="flex-1">
                          <Skeleton className="flex-1 h-10" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <NewStudySetCard
                      obj={data!.body[cardId]}
                      cardId={cardId as string}
                      index={i}
                      key={cardId}
                      setId={data!.id}
                      type={type}
                      removeCard={(cardId: string) =>
                        editStudyCardAmount({ action: "remove", cardId })
                      }
                    />
                  )}
                </motion.div>
              );
            })}
            <motion.div
              layout
              className="transition-all"
              key="something in the whey she moves"
              initial={{ opacity: 0.5, scale: 0.5, y: "20%" }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <MobileTap
                onClick={() => editStudyCardAmount({ action: "add" })}
                className="group w-full relative bg-white/10 rounded-xl flex items-center justify-center p-10 hover:scale-105 transition cursor-pointer"
              >
                <div className="border-b-4 border-blue-500 pb-2 font-bold text-xl group-hover:border-indigo-600 transition w-fit">
                  + New Card
                </div>
                <div className="absolute left-10 font-bold text-xl">
                  {Object.keys(data!.body).length + 1}
                </div>
              </MobileTap>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SetEditor;

//sm:h-[182px] h-[262px]
