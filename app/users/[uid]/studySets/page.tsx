"use client";
import Loader from "@components/Loader";
import SetSettings from "@components/SetSettings";
import { useAuth } from "@context/AuthContext";
import { getUserLibrary } from "@firebase/hooks";
import { useQuery } from "@tanstack/react-query";
import { IUseAuth } from "@utils/declarations";
import Link from "next/link";
import { useParams } from "next/navigation";

const UserStudySetsPage = () => {
  const pathParams = useParams();
  const { currentUser }: IUseAuth = useAuth();
  const { data, error, isLoading, isError } = useQuery({
    queryKey: [
      "userSets",
      { user: pathParams.uid },
      { currentUser: currentUser?.uid },
    ],
    queryFn: () =>
      getUserLibrary(
        pathParams.uid as string,
        pathParams.uid === currentUser?.uid
      ),
  });

  if (isLoading) return <Loader />;
  if (isError) return <div>{error.message}</div>;

  return (
    <div className="flex flex-col gap-5">
      {data?.length === 0 ? (
        <div>User either has not created any sets or they are private</div>
      ) : (
        data?.map((obj) => (
          <div
            className={`px-8 py-4 rounded-xl w-full bg-white/20 flex md:flex-row flex-col justify-between gap-5 text-start ${
              pathParams.uid === currentUser?.uid && "items-center"
            }`}
          >
            <Link
              href={`/sets/${obj.id}`}
              className="flex flex-col gap-2 flex-1 hover:scale-[1.02] transition group"
            >
              <div className="text-lg font-medium group-hover:underline text-center sm:text-start">
                {obj.title}
              </div>
              <div className="text-sm italic font-medium text-center  sm:text-start">
                {obj.description}
              </div>
            </Link>
            {!isLoading && currentUser?.uid === obj.creator && (
              <SetSettings
                setId={obj.id}
                isPublic={obj.isPublic!}
                title={obj.title}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default UserStudySetsPage;
