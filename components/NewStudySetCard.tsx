import InputField from "./InputField";
import SVG from "react-inlinesvg";

import { ISetCard } from "../utils/declarations";

interface IProps {
  obj: ISetCard;
  cardId: string;
  index: number;
  setId: string;
  type: string;
  removeCard: (cardId: string) => void;
}

const NewStudySetCard = ({ obj, cardId, index, setId, removeCard }: IProps) => {
  return (
    <div className="w-full bg-white/10 rounded-xl">
      {/* HEADER */}
      <div className="border-b-2 border-black/30 p-5 flex justify-between">
        <div className="font-bold text-lg">{index + 1}</div>
        <button
          onClick={() => removeCard(cardId)}
          className="hover:scale-110 group"
        >
          <SVG
            src="/icons/trash.svg"
            className="h-6 w-6 fill-white group-hover:fill-indigo-500 transition"
            loader={<div className="h-6 w-6" />}
          />
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-10 p-5 pt-10">
        {/* TERM */}
        <div className="grow">
          <InputField
            value={obj.term}
            type="term"
            cardId={cardId}
            label="TERM"
            placeholder="Enter something..."
            setId={setId}
          />
        </div>

        {/* DEF */}
        <div className="grow">
          <InputField
            value={obj.definition}
            cardId={cardId}
            type="definition"
            label="DEFINITION"
            placeholder="Enter something..."
            setId={setId}
          />
        </div>
      </div>
    </div>
  );
};

export default NewStudySetCard;
