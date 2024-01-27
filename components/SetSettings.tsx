import Link from "next/link";
import SVG from "react-inlinesvg";
import MobileTap from "./MobileTap";
import { useState } from "react";
import SubmitBox from "./SubmitBox";
import { useParams, usePathname } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { editPublicity, getStudySet } from "@firebase/hooks";

interface ISetSettings {
  setId: string;
  isPublic: boolean;
  title: string;
}

const SetSettings = ({ setId, isPublic, title }: ISetSettings) => {
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [action, setAction] = useState("");
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { mutateAsync: mutatePublicity } = useMutation({
    mutationFn: (isPublic: boolean) => editPublicity(setId, isPublic),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [setId] });
    },
  });
  return (
    <div>
      <SubmitBox
        title={title}
        isSubmitOpen={isSubmitOpen}
        setIsSubmitOpen={setIsSubmitOpen}
        setId={setId}
        action={action}
      />
      <div className="flex gap-4 items-center">
        <div>
          <label className="relative inline-flex cursor-pointer select-none items-center gap-2 w-[108px] h-10">
            <input
              type="checkbox"
              name="autoSaver"
              className="sr-only peer"
              defaultChecked={isPublic}
              onChange={(e) => mutatePublicity(e.target.checked)}
            />
            <div
              className={`h-full w-full items-center rounded-full duration-200 peer-checked:bg-indigo-600 bg-red-600 absolute`}
            />
            <SVG
              className="h-5 w-5 z-10 fill-white peer-checked:hidden ml-3"
              src="/icons/lock-closed.svg"
              loader={<div className="h-5 w-5 ml-2" />}
            />
            <SVG
              className="h-5 w-5 z-10 fill-white peer-checked:block hidden ml-3"
              src="/icons/lock-open.svg"
              loader={<div className="h-5 w-5 ml-2" />}
            />

            <div className="pointer-events-none peer-checked:hidden font-medium z-10">
              Private
            </div>
            <div className="pointer-events-none peer-checked:block hidden font-medium z-10">
              Public
            </div>
          </label>
        </div>
        {pathname.slice(0, pathname.indexOf("/", 1)) !== "/edit-set" && (
          <Link
            href={`/edit-set/${setId}`}
            className="transition border-2 border-white hover:bg-white/20 rounded-full p-2 cursor-pointer"
          >
            <SVG
              src="/icons/edit.svg"
              className="h-6 w-6 fill-white "
              loader={<div className="h-6 w-6" />}
            />
          </Link>
        )}

        <MobileTap
          className="border-2 border-white rounded-full p-2 hover:bg-white/20 transition"
          onClick={() => {
            setAction("archive");
            setIsSubmitOpen(true);
          }}
        >
          <SVG
            className="h-6 w-6 fill-white"
            src="/icons/archive.svg"
            loader={<div className="h-6 w-6" />}
          />
        </MobileTap>
        <MobileTap
          className="border-2 border-white rounded-full p-2 hover:bg-white/20 transition"
          onClick={() => {
            setAction("delete");
            setIsSubmitOpen(true);
          }}
        >
          <SVG
            className="h-6 w-6 fill-white"
            src="/icons/trash.svg"
            loader={<div className="h-6 w-6" />}
          />
        </MobileTap>
      </div>
    </div>
  );
};

export default SetSettings;
