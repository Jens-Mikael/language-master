import Loader from "@components/Loader";
import Skeleton from "react-loading-skeleton";

export default function Home() {
  return (
    <div className="flex-1 text-slate-500 ">
      <Skeleton className="h-20" baseColor="rgb(100 116 139)" />
    </div>
  );
}

//rgb(79 70 229)