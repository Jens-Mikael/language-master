"use client";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";
import { getStudySet } from "@/firebase/hooks";
import SVG from "react-inlinesvg";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { useState, useEffect } from "react";

const variants = {
  visible: { scale: 1, x: 0, rotate: 0 },
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

const LearnFlashcards = () => {
  const [keys, setKeys] = useState();
  const [currentKey, setCurrentKey] = useState();
  const [count, setCount] = useState(0);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = useParams();
  const { data, isLoading, error } = useQuery(pathname.id, () =>
    getStudySet(pathname.id)
  );
  useEffect(() => {
    if (data) {
      setKeys(Object.keys(data.body));
      setCurrentKey(Object.keys(data.body)[0]);
    }
  }, [data]);

  useEffect(() => {
    if (keys) {
      setCurrentKey(keys[count]);
      setProgress(
        Math.round(
          ((Object.keys(data.body).length - keys.length) /
            Object.keys(data.body).length) *
            100
        ).toString()
      );
      if (keys.length <= count) {
        setCount(0);
        setCurrentKey(keys[0]);
      }
    }
  }, [keys]);

  const handleClick = () => {
    if (keys.length <= 1) setSuccess(true);
    setKeys((prev) => {
      return prev.filter((num, i) => i != count);
    });
  };

  const shuffleKeys = () => {
    setKeys((prev) => prev.sort((a, b) => 0.5 - Math.random()));
  };

  if (isLoading || !keys) return <div className="">loading...</div>;
  if (error) return <div>erro</div>;

  console.log(keys);

  return (
    <div className="h-full">
      {/* PROGRESS BAR */}
      <div
        className={`h-0.5 bg-blue-500 w-[${progress}%] transition-[width] duration-1000`}
      />
      {success ? (
        <>
          <div className="h-full flex justify-center py-20">
            <div className="flex flex-col gap-16">
              <div className="font-bold text-5xl">Nice Work!</div>
              <div className="flex flex-col gap-2">
                <div className="font-bold text-2xl">How you're doing</div>
                <div className="flex">
                  <div>Icons</div>
                  <div>Statistics</div>
                </div>
              </div>
            </div>
          </div>
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
                  whileTap={{ rotateY: 180 }}
                  exit="exitRight"
                  variants={variants}
                  className="transformStyle-3d relative cursor-pointer flex items-center justify-center text-4xl font-light w-full h-full bg-white/10 rounded-lg shadow-[0px_0px_12px_0px_rgba(255,255,255,0.75)] shadow-white/20"
                >
                  <div className="backface-hidden transformStyle-3d absolute rotate-0 opacity-95">
                    {data.body[currentKey].term}
                  </div>
                  <div className="backface-hidden transformStyle-3d absolute transform-y-180 opacity-95">
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
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LearnFlashcards;
