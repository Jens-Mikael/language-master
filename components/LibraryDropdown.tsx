import { useAuth } from "@context/AuthContext";
import { getUserLibrary } from "@firebase/hooks";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { ILibraryCard, IUseAuth } from "../utils/declarations";
import { ReactElement } from "react";

interface ILibraryDropdown {
  setIsLibraryOpen: (isOpen: boolean) => void;
  setSidebarOpen?: (isOpen: boolean) => void;
}

const LibraryDropdown = ({
  setIsLibraryOpen,
  setSidebarOpen,
}: ILibraryDropdown): ReactElement<any, any> => {
  const pathname = usePathname();
  const { currentUser }: IUseAuth = useAuth();
  const { data, isLoading, isError, error } = useQuery<ILibraryCard[]>({
    queryKey: ["userSets", { user: currentUser?.uid }],
    queryFn: (): Promise<ILibraryCard[]> => getUserLibrary(currentUser?.uid!),
  });
  if (isLoading) return <div>loadin</div>;
  if (isError) return <div>{error.message}</div>;
  return (
    <div className="flex sm:z-20 gap-3 pt-2 sm:absolute sm:top-full sm:right-0 sm:mt-2 sm:border border-white/20 sm:rounded-xl flex-col overflow-hidden bg-[#0A092D]">
      {data?.map((i: ILibraryCard) => (
        <Link
          onClick={() => {
            if (setSidebarOpen) {
              setSidebarOpen(false);
            } else setIsLibraryOpen(false);
          }}
          key={i.id}
          href={`/sets/${i.id}`}
          className={`relative pl-4 group`}
        >
          <div
            className={`${
              pathname === `/sets/${i.id}` ? "w-1" : "group-hover:w-1 w-0"
            } absolute left-0 h-full bg-blue-500 rounded transition-all`}
          />
          {i.title}
        </Link>
      ))}
      <div
        className={`py-2 px-4 border-t border-white/20 cursor-pointer transition hover:text-indigo-500`}
      >
        View all sets
      </div>
    </div>
  );
};

export default LibraryDropdown;
