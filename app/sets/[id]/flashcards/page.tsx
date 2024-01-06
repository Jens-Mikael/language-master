"use client";
import LearnNavbar from "@components/LearnNavbar";
import PractiseFlashcards from "@components/PractiseFlashcards";
import { useState } from "react";
import { ISetCard } from "../../../../declarations";

const Layout = () => {
  const [keys, setKeys] = useState<string[]>([]);

  return (
    <div className="absolute z-20 inset-0">
      <div className="h-full bg-[#0A092D] flex flex-col">
        <LearnNavbar keys={keys} />
        <PractiseFlashcards keys={keys} setKeys={setKeys} />
      </div>
    </div>
  );
};

export default Layout;
