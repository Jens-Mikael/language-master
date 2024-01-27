"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import MobileTap from "./MobileTap";
import PropagateLoader from "react-spinners/PropagateLoader";
import { writeArchiveSet } from "@firebase/hooks/write";
import { useParams, useRouter } from "next/navigation";
import { deleteStudySet } from "@firebase/hooks";
import { IUseAuth } from "@utils/declarations";
import { useAuth } from "@context/AuthContext";

interface IProps {
  title?: string;
  isSubmitOpen: boolean;
  setIsSubmitOpen: (isOpen: boolean) => void;
  action: string;
  setId?: string;
}

const SubmitBox = ({
  title,
  isSubmitOpen,
  setIsSubmitOpen,
  action,
  setId,
}: IProps) => {
  const { uid }: IUseAuth = useAuth();
  const pathname = useParams();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync: handleSubmit, isPending: isPending } = useMutation({
    mutationFn: (archive: boolean) =>
      action === "delete"
        ? deleteStudySet(pathname.id as string, uid!)
        : writeArchiveSet(
            action === "archive" ? (pathname.id as string) : setId!,
            archive,
            uid!
          ),
    onSuccess: () => {
      queryClient.invalidateQueries(
        action === "unArchive"
          ? { queryKey: ["userArchive", { user: pathname.uid }] }
          : { queryKey: [pathname.id] }
      );
      setIsSubmitOpen(false);
    },
  });
  return (
    <div
      className={`${
        isSubmitOpen ? "translate-y-0" : "-translate-y-full"
      } fixed inset-0 flex z-20 transition-transform duration-300`}
    >
      <div className="relative flex-1 flex items-center justify-center">
        <div className="z-20 bg-[#0A092D] border border-white/50 rounded-xl w-full max-w-[500px] min-h-[200px] p-8 flex justify-center  flex-col gap-12 mx-5">
          {!isPending ? (
            <>
              <div className="flex flex-col gap-2">
                <div className="text-xl sm:text-3xl flex gap-1">
                  {action === "delete" && "Delete"}
                  {action === "archive" && "Archive"}
                  {action === "unArchive" && "Unarchive"}
                  <div className="italic font-medium">{title}</div>
                </div>
                <div className="text-sm font-light">
                  {action === "delete" &&
                    "Are you sure you want to delete this study set? If so it will be deleted from our database and can not be viewed. This process can not be undone."}
                  {action === "archive" &&
                    "Are you sure you want to archive this study set? If so it will be hidden from everyone and archived in a separate storage. This process can be though undone so nothing will be lost."}
                  {action === "unArchive" &&
                    "Are you sure you want to unarchive this study set? This action will bring it back to life and make it usuable once again."}
                </div>
              </div>
              <div className="flex gap-5 self-center">
                <MobileTap
                  onClick={() => setIsSubmitOpen(false)}
                  className="border border-white/50 hover:bg-white/10 text-lg font-bold transition rounded-lg px-5 py-3"
                >
                  Close
                </MobileTap>
                <MobileTap
                  onClick={() => handleSubmit(action === "archive")}
                  className="bg-blue-500 hover:bg-indigo-600 text-lg font-bold transition rounded-lg px-5 py-3"
                >
                  Submit
                </MobileTap>
              </div>
            </>
          ) : (
            <div className="self-center h-full justify-center">
              <PropagateLoader color="#ffffff" />
            </div>
          )}
        </div>
        <div
          className="absolute inset-0"
          onClick={() => setIsSubmitOpen(false)}
        />
      </div>
    </div>
  );
};

export default SubmitBox;
