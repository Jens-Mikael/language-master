import { useAuth } from "@/firebase/context/AuthContext";
import { getLibrarySets } from "@/firebase/hooks";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

const LibraryDropdown = ({ setIsLibraryOpen }) => {
  const { currentUser } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["librarySets"],
    queryFn: () => getLibrarySets(currentUser.uid),
  });
  if (isLoading) return <div>loading</div>;
  if (error) return console.log(error);
  return (
    <div className="flex gap-2 p-2 z-20 absolute top-full right-0 mt-2 border border-white/20 rounded-xl flex-col overflow-hidden bg-[#0A092D]">
      {data.map((i) => (
        <Link
          onClick={() => setIsLibraryOpen(false)}
          key={i.id}
          href={`/sets/${i.id}`}
        >
          {i.title}
        </Link>
      ))}
    </div>
  );
};

export default LibraryDropdown;
