import SVG from "react-inlinesvg";

const SearchBar = ({ input, setInput }) => {
  return (
    <div
      className={`grow min-w-[200px] max-w-3xl items-center justify-center text-sm relative flex`}
    >
      <SVG
        src="/icons/search.svg"
        className="h-6 w-6 fill-white absolute left-3 "
        loader={<div className="h-6 w-6 absolute left-3" />}
      />
      
      <input
        type="text"
        placeholder="Search for anything..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={`w-full bg-white/20 focus:ring-none focus:outline outline-white rounded-full py-2 transition ${
          input ? "px-11" : "pr-2 pl-11"
        }`}
      />
      <SVG
        src="/icons/remove.svg"
        className={`h-6 w-6 fill-white absolute right-3 cursor-pointer ${
          !input && "hidden"
        }`}
        onClick={() => setInput("")}
        loader={<div className="h-6 w-6 absolute right-3" />}
      />
    </div>
  );
};

export default SearchBar;
