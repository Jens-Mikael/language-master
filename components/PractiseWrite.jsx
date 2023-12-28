"use client";
import { useState, useEffect } from "react";
import SVG from "react-inlinesvg";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getStudySet } from "@/firebase/hooks";
import { useAnimate } from "framer-motion";
import PractiseSuccess from "./PractiseSuccess";

const PractiseWrite = ({ keys, setKeys }) => {
  const [input, setInput] = useState("");
  const [side, setSide] = useState("term");
  const [triesCount, setTriesCount] = useState(0);
  const [fails, setFails] = useState(0);
  const [count, setCount] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);
  const [success, setSuccess] = useState(false);
  const pathParams = useParams();
  const [scope, animate] = useAnimate();

  const { data, isLoading, error } = useQuery({
    queryKey: [pathParams.id],
    queryFn: () => getStudySet(pathParams.id),
  });

  const reset = (e) => {
    if (e.key === "Enter") {
      setSuccess(false);
      setFails(0);
      setCount(0);
      setKeys(Object.keys(data.body));
      setInput("");
      setTriesCount(0);
      document.removeEventListener("keydown", reset);
    }
  };

  useEffect(() => {
    if (data) {
      setKeys(Object.keys(data.body));
    }
  }, [data, setKeys]);

  useEffect(() => {
    if (success) {
      document.addEventListener("keydown", reset);
      console.log("add");
    }
  }, [success, reset]);

  const handleEnter = async () => {
    if (showCorrect) {
      setShowCorrect(false);
      setInput("");
      setCount((prev) => (keys.length - 1 <= prev ? 0 : prev + 1));
      return;
    }
    if (input === data.body[keys[count]][side === "term" ? "definition" : "term"]) {
      if (keys.length <= 1) return setSuccess(true);
      if (triesCount === 0) {
        setKeys((prev) => {
          return prev.filter((num, i) => i != count);
        });
        setCount((prev) => (keys.length - 1 <= prev ? 0 : prev));
      } else {
        setCount((prev) => (keys.length - 1 <= prev ? 0 : prev + 1));
        setTriesCount(0);
      }
      setInput("");
      await animate(
        scope.current,
        {
          outlineColor: [
            "rgb(0,255,0,1)",
            "rgb(0,255,0,1)",
            "rgba(255,255,255,0.6)",
          ],
        },
        { duration: 0.3 }
      );
    } else {
      if (triesCount < 3) {
        setFails((prev) => (prev <= count + 1 ? count + 1 : prev));
        setTriesCount((prev) => prev + 1);
        setInput(data.body[keys[count]][side === "term" ? "definition" : "term"].slice(0, triesCount + 1));
        await animate(
          scope.current,
          {
            x: [25, -25, 25, -25, 25, -25, 0],
            y: [25, -25, 25, -25, 25, -25, 0],
            rotate: [25, -25, 25, -25, 25, -25, 0],
            outlineColor: ["rgb(255,0,0,1)"],
          },
          { duration: 0.2 }
        );
        animate(
          scope.current,
          {
            outlineColor: ["rgba(255,255,255,0.6)"],
          },
          { duration: 0 }
        );
      } else {
        setInput(data.body[keys[count]][side === "term" ? "definition" : "term"]);
        setTriesCount(0);
        setShowCorrect(true);
      }
    }
  };

  const shuffleKeys = () => {
    setKeys((prev) => prev.sort((a, b) => 0.5 - Math.random()));
  };



  if (isLoading || !keys) return <div>loading</div>;

  return (
    <div className="h-full">
      {success ? (
        <PractiseSuccess
          fails={fails}
          bodyLength={Object.keys(data.body).length}
        />
      ) : (
        <div className="flex h-full justify-center items-center pb-36 pt-14 px-8">
          <div className="flex flex-col w-full max-w-3xl gap-14">
            <div className="bg-white/10 rounded-lg shadow-[0px_0px_12px_0px_rgba(255,255,255,0.75)] shadow-white/20 px-8 sm:px-12 py-10 sm:py-16 flex flex-col gap-10">
              <div className="text-4xl font-light">
                {data.body[keys[count]][side]}
              </div>
              <div className="bg-white/10 h-0.5" />
              <div className="flex flex-col sm:flex-row gap-10">
                <textarea
                  className="max-h-13 p-3 scrollbar-none resize-none bg-transparent flex-1 ring-none focus:outline-white/60 outline-white/30 outline outline-2  rounded-lg font-light text-xl transition-all"
                  rows="1"
                  id="writeTextarea"
                  placeholder="Definition..."
                  onFocus={() => {}}
                  onBlur={(e) => {}}
                  ref={scope}
                  value={input}
                  onKeyDown={(e) => e.key === "Enter" && handleEnter()}
                  onChange={(e) => {
                    const textarea = e.target;
                    if (e.nativeEvent.inputType === "insertLineBreak") return;
                    setInput(textarea.value);
                    textarea.style.height = "auto";
                    const scrollHeight = textarea.scrollHeight;
                    textarea.style.height = `${scrollHeight}px`;
                  }}
                />
                <button
                  onClick={() => setCount((prev) => prev + 1)}
                  className="px-3 py-3 h-min w-fit rounded-lg bg-blue-600 hover:bg-indigo-600 hover:scale-105 transition"
                >
                  Don't know.
                </button>
              </div>
            </div>
            <div className="flex gap-5 justify-between">
              <div>
                <button className="hover:bg-white/10 transition rounded-full p-2 h-min">
                  <SVG
                    src="/icons/undo.svg"
                    className="h-7 w-7 fill-white"
                    loader={<div className="h-7 w-7" />}
                  />
                </button>
              </div>
              <div className="flex gap-5">
                <button
                  onClick={() => shuffleKeys()}
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
                    setSide((prev) => (prev === "term" ? "definition" : "term"))
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
      )}
    </div>
  );
};

export default PractiseWrite;

// y: [0, -100, 0, 150, 0, -100, 0, 0],
//           x: [0, 0, -100, 0, 150, 0, -100, 0],
