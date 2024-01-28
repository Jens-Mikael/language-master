"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import MobileTap from "./MobileTap";
import PropagateLoader from "react-spinners/PropagateLoader";
import { writeArchiveSet } from "@firebase/hooks/write";
import { useParams, useRouter } from "next/navigation";
import { deleteStudySet } from "@firebase/hooks";
import { IUseAuth } from "@utils/declarations";
import { useAuth } from "@context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

interface IProps {
  title?: string;
  isSubmitOpen: boolean;
  setIsSubmitOpen: (isOpen: boolean) => void;
  action: string;
  setId: string;
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

  const { mutateAsync: handleSubmit, isPending: isPending } = useMutation({
    mutationFn: (archive: boolean) =>
      action === "delete"
        ? deleteStudySet(setId, uid!)
        : writeArchiveSet(setId, archive, uid!),
    onSuccess: () => {
      switch (action) {
        case "unArchive":
          queryClient.invalidateQueries({
            queryKey: ["userArchive", { user: pathname.uid }],
          });
          break;
        case "archive":
          queryClient.invalidateQueries({
            queryKey: ["userSets", { user: pathname.uid }],
          });
          queryClient.invalidateQueries({ queryKey: [pathname.id] });

          break;
        case "delete":
          queryClient.invalidateQueries({ queryKey: [pathname.id] });
          queryClient.invalidateQueries({
            queryKey: ["userSets", { user: pathname.uid }],
          });
          break;
        default:
          console.log("invalid action in SubmiBox");
          break;
      }
      setIsSubmitOpen(false);
    },
  });

  return (
    <AnimatePresence>
      {isSubmitOpen && (
        <motion.div
          initial={{ translateY: "100vh" }}
          animate={{ translateY: 0 }}
          exit={{ translateY: "100vh" }}
          className={`fixed inset-0 flex z-20`}
        >
          <div className="relative flex-1 flex items-center justify-center">
            <div className="z-20 bg-[#0A092D] border border-white/50 rounded-xl w-full max-w-[500px] min-h-[200px] p-8 flex justify-center  flex-col gap-12 mx-5">
              {!isPending ? (
                <>
                  <div className="flex flex-col gap-2">
                    <div className="text-xl sm:text-3xl">
                      {action === "delete" && "Delete"}
                      {action === "archive" && "Archive"}
                      {action === "unArchive" && "Unarchive"}{" "}
                      <span className="italic font-medium">{title}</span>
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubmitBox;
