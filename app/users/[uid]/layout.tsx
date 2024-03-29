"use client";
import { useAuth } from "@context/AuthContext";
import { getUserInfo } from "@firebase/hooks/read";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ReactNode } from "react";
import { IUseAuth } from "../../../utils/declarations";
import Loader from "@components/Loader";

interface IProps {
  children: ReactNode;
}

const UserLayout = ({ children }: IProps) => {
  const pathParams = useParams();
  const pathname = usePathname();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [pathParams.uid],
    queryFn: () => getUserInfo(pathParams.uid as string),
  });
  const { currentUser }: IUseAuth = useAuth();

  if (isLoading) return <Loader />;
  if (isError) return <div>{error.message}</div>;

  return (
    <div className="flex justify-center flex-1">
      <div className="max-w-5xl w-full flex flex-col gap-5">
        {/* HEADER */}
        <div className="flex">
        <div className="flex gap-5">
            <div className="flex items-center">
              <Image
                className="rounded-full h-min"
                src={data!.photoURL}
                alt="pfp"
                width={72}
                height={72}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-bold text-2xl">{data?.displayName}</div>
              <div className="italic text-sm text-white/70">{data?.email}</div>
            </div>
          </div>
        </div>
        {/* NAVIGATION */}
        <div className="flex items-end">
          {pathParams.uid === currentUser?.uid && (
            <>
              <Link
                href={`/users/${pathParams.uid}`}
                className={`h-full py-3 text-sm font-medium border-b-2 transition cursor-pointer ${
                  pathname === `/users/${pathParams.uid}`
                    ? "border-indigo-500"
                    : "border-white/20 hover:border-indigo-500"
                }`}
              >
                Account
              </Link>
              <div className="w-10 border-b-2 border-white/20" />
            </>
          )}
          <Link
            href={`/users/${pathParams.uid}/studySets`}
            className={`h-full py-3 text-sm font-medium border-b-2 transition cursor-pointer ${
              pathname === `/users/${pathParams.uid}/studySets`
                ? "border-indigo-500"
                : "border-white/20 hover:border-indigo-500"
            }`}
          >
            StudySets
          </Link>
          
          {pathParams.uid === currentUser?.uid && (
            <>
              <div className="w-10 border-b-2 border-white/20" />
              <Link
                href={`/users/${pathParams.uid}/archive`}
                className={`h-full py-3 text-sm font-medium border-b-2 transition cursor-pointer ${
                  pathname === `/users/${pathParams.uid}/archive`
                    ? "border-indigo-500"
                    : "border-white/20 hover:border-indigo-500"
                }`}
              >
                Archive
              </Link>
            </>
          )}

          <div className="flex-1 border-b-2 border-white/20" />
        </div>
        {/* CONTENT */}
        {children}
      </div>
    </div>
  );
};

export default UserLayout;
