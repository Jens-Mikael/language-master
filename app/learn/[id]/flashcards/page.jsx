"use client";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";
import { getStudySet } from "@/firebase/hooks";
import SVG from "react-inlinesvg";
import {
  useAnimate,
  usePresence,
  useAnimation,
  AnimatePresence,
  motion,
} from "framer-motion";
import { useState, forwardRef, useEffect } from "react";
import React from "react";

const LearnFlashcards = () => {
  // const [isAnimating, setIsAnimating] = useState(false);
  // const controls = useAnimation();
  const [scope, animate] = useAnimate();
  const [count, setCount] = useState(0);
  const pathname = useParams();
  const { data, isLoading } = useQuery(pathname.id, () =>
    getStudySet(pathname.id)
  );

  const handleAnimation = async () => {
    await animate(
      scope.current,
      { scale: [1, 0.25], opacity: [1, 0] },
      { duration: 0.2 }
    );
    console.log("middle");
    animate(
      scope.current,
      { scale: [0.25, 1], opacity: [0, 1] },
      { duration: 0.2 }
    );
  };

  // const handleAnimationTemp = async () => {
  //   if (isAnimating) return;
  //   setIsAnimating(true);
  //   await controls.start(
  //     { scale: [1, 0.25, 1], opacity: [1, 0, 1] },
  //     { duration: 0.2 }
  //   );

  //   console.log("middle");
  //   await controls.start(
  //     { scale: [0.25, 1], opacity: [0, 1] },
  //     { duration: 0.2 }
  //   );
  //   setIsAnimating(false);
  // };

  // useEffect(() => {
  //   controls.set({ opacity: 1, scale: 1, x: 0, rotate: 0 });
  // }, [count]);

  const Card = forwardRef((props, ref) => (
    <motion.div
      ref={ref}
      onClick={handleAnimation}
      transition={{ duration: 0.2 }}
      initial={{ opacity: 0, scale: 0.5, x: "-100vh" }}
      animate={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
      exit={{
        opacity: 0,
        scale: 0.5,
        x: "100vh",
        rotate: 30,
      }}
      className="absolute cursor-pointer flex items-center justify-center text-4xl font-light w-full h-full bg-white/20 rounded-lg shadow-[0px_0px_12px_0px_rgba(255,255,255,0.75)] shadow-white/20"
    >
      {props.children}
    </motion.div>
  ));

  if (isLoading) return <div className="">loading...</div>;
  return (
    <div className="h-full items-center flex justify-center">
      <div className="flex flex-col gap-5 h-full max-w-5xl w-full py-5">
        <div className="grow relative">
          <AnimatePresence mode="wait">
            <Card key={count} ref={scope}>
              {count}
            </Card>
          </AnimatePresence>
        </div>

        <div>{count}</div>

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
              onClick={() => setCount((prev) => prev - 1)}
              className="p-2 border-2 border-white/20 hover:bg-white/10 transition rounded-full"
            >
              <SVG
                src="/icons/remove.svg"
                className="h-8 w-8 fill-red-500"
                loader={<div className="h-8 w-8" />}
              />
            </button>
            <button
              onClick={() => setCount((prev) => prev + 1)}
              className="p-2 border-2 border-white/20 hover:bg-white/10 transition rounded-full"
            >
              <SVG
                src="/icons/done.svg"
                className="h-8 w-8 fill-green-500"
                loader={<div className="h-8 w-8" />}
              />
            </button>
          </div>
          <button className="border-2 border-white/20 hover:bg-white/10 h-min p-2 rounded-full">
            <SVG
              src="/icons/shuffle.svg"
              className="h-7 w-7 fill-white"
              loader={<div className="h-7 w-7" />}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearnFlashcards;
