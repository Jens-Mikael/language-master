"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getStudySet } from "@/firebase/hooks";
import SVG from "react-inlinesvg";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import PractiseSuccess from "./PractiseSuccess";

const PractiseFlashcards = ({ keys, setKeys }) => {
  const [currentKey, setCurrentKey] = useState();
  const [count, setCount] = useState(0);
  const [success, setSuccess] = useState(false);
  const [side, setSide] = useState("term");
  const [fails, setFails] = useState(0);
  const pathParams = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: [pathParams.id],
    queryFn: () => getStudySet(pathParams.id),
  });
  useEffect(() => {
    if (data) {
      setKeys(Object.keys(data.body));
      setCurrentKey(Object.keys(data.body)[0]);
    }
  }, [data, setKeys]);

  useEffect(() => {
    if (keys) {
      console.log("dew");
      setCurrentKey(keys[count]);
      if (keys.length <= count) {
        setCount(0);
        setFails((prev) => (count > prev ? count : prev));
        setCurrentKey(keys[0]);
        console.log("ran");
      }
    }
  }, [keys, count]);

  useEffect(() => {
    if (success) {
      document.addEventListener("keydown", reset);
    }
  }, [success, reset]);

  const handleClick = () => {
    if (keys.length <= 1) setSuccess(true);
    setKeys((prev) => {
      return prev.filter((num, i) => i != count);
    });
  };

  const shuffleKeys = () => {
    setKeys((prev) => prev.sort((a, b) => 0.5 - Math.random()));
  };

  const reset = (e) => {
    if (e.key === "Enter") {
      setSuccess(false);
      setFails(0);
      setCount(0);
      setKeys(Object.keys(data.body));
      setCurrentKey(Object.keys(data.body)[0]);
      document.removeEventListener("keydown", reset);
    }
  };

  const variants = {
    visible: { scale: 1, x: 0, rotateY: side === "definition" ? 180 : 0 },
    entry: { scale: 0.25, x: "-100vh" },
    exitRight: {
      opacity: 0,
      scale: 0.5,
      x: "100vh",
      rotate: 30,
    },
    exitLeft: {
      opacity: 0,
      scale: 0.5,
      x: "-100vh",
      rotate: -30,
    },
  };

  if (isLoading || !keys) return <div>loading...</div>;
  if (error) return <div>erro</div>;

  return (
    <div className="h-full">
      {success ? (
        <>
          <PractiseSuccess
            fails={fails}
            bodyLength={Object.keys(data.body).length}
          />
        </>
      ) : (
        <>
          <div className="h-full items-center flex justify-center">
            <div className="flex flex-col gap-5 h-full max-w-5xl w-full py-5">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentKey}
                  transition={{ duration: 0.5 }}
                  initial="entry"
                  animate="visible"
                  whileTap={{ rotateY: side === "term" ? 180 : 0 }}
                  exit="exitRight"
                  variants={variants}
                  className="transformStyle-3d relative cursor-pointer flex items-center justify-center text-4xl font-light w-full h-full bg-white/10 rounded-lg shadow-[0px_0px_12px_0px_rgba(255,255,255,0.75)] shadow-white/20"
                >
                  <div
                    className={`backface-hidden transformStyle-3d absolute transition-all rotate-0 opacity-95 `}
                  >
                    {data.body[currentKey].term}
                  </div>
                  <div
                    className={`backface-hidden transformStyle-3d absolute transition-all transform-y-180 opacity-95 `}
                  >
                    {data.body[currentKey].definition}
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-between">
                <button className="hover:bg-white/10 transition rounded-full p-2 h-min">
                  <SVG
                    src="/icons/undo.svg"
                    className="h-7 w-7 fill-white"
                    loader={<div className="h-7 w-7" />}
                  />
                </button>
                <div className="flex gap-10">
                  <button
                    onClick={() => {
                      setCount((prev) => {
                        if (count >= keys.length - 1) {
                          setCurrentKey(keys[0]);
                          return 0;
                        }
                        setCurrentKey(keys[prev + 1]);
                        return prev + 1;
                      });
                    }}
                    className="p-2 border-2 border-white/20 hover:bg-white/10 transition rounded-full"
                  >
                    <SVG
                      src="/icons/remove.svg"
                      className="h-8 w-8 fill-red-500"
                      loader={<div className="h-8 w-8" />}
                    />
                  </button>
                  <button
                    onClick={() => {
                      handleClick();
                    }}
                    className="p-2 border-2 border-white/20 hover:bg-white/10 transition rounded-full"
                  >
                    <SVG
                      src="/icons/done.svg"
                      className="h-8 w-8 fill-green-500"
                      loader={<div className="h-8 w-8" />}
                    />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={shuffleKeys}
                    className="border-2 border-white/20 hover:bg-white/10 h-min p-2 rounded-full"
                  >
                    <SVG
                      src="/icons/shuffle.svg"
                      className="h-7 w-7 fill-white"
                      loader={<div className="h-7 w-7" />}
                    />
                  </button>
                  <button
                    onClick={() =>
                      setSide((prev) =>
                        prev === "term" ? "definition" : "term"
                      )
                    }
                    className="border-2 border-white/20 hover:bg-white/10 h-min p-2 rounded-full"
                  >
                    <SVG
                      src="/icons/switch-card.svg"
                      className="h-7 w-7 fill-white"
                      loader={<div className="h-7 w-7" />}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PractiseFlashcards;
