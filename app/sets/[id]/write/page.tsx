"use client";
import LearnNavbar from "@components/LearnNavbar";
import PractiseWrite from "@components/PractiseWrite";
import { useState } from "react";

const PractiseWritePage = () => {
  const [keys, setKeys] = useState<string[]>([]);
  return (
    <div className="absolute z-20 inset-0 overflow-hidden">
      <div className="h-full bg-[#0A092D] flex flex-col">
        <LearnNavbar keys={keys} />
        <PractiseWrite keys={keys} setKeys={setKeys} />
      </div>
    </div>
  );
};

export default PractiseWritePage;
