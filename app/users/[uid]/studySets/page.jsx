"use client";
import MobileTap from "@/components/MobileTap";
import { getUserLibrary } from "@/firebase/hooks";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";

const UserStudySetsPage = () => {
  const pathParams = useParams();
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["userSets", { user: pathParams.uid }],
    queryFn: () => getUserLibrary(pathParams.uid),
  });

  if (isLoading) return <div>loading</div>;
  if (isError) return <div>{error.message}</div>;

  return (
    <div className="flex flex-col gap-5">
      {data.map((obj) => (
        <MobileTap>
          <Link
            className="px-8 py-4 rounded-xl w-full bg-white/20 hover:scale-105 transition flex flex-col gap-2 text-start"
            href={`/sets/${obj.id}`}
          >
            <div className="text-lg font-medium">{obj.title}</div>
            <div className="text-sm italic font-medium">{obj.description}</div>
          </Link>
        </MobileTap>
      ))}
    </div>
  );
};

export default UserStudySetsPage;
