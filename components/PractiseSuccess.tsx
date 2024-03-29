//import { DonutChart } from "react-circle-chart";
// import LineChart from "@/components/LineChart";
import { isMobile } from "react-device-detect";
import MobileTap from "./MobileTap";

interface IProps {
  fails: number;
  bodyLength: number;
  mobileReset?: () => void;
}

const PractiseSuccess = ({ fails, bodyLength, mobileReset }: IProps) => {
  const donutArgs = {
    size: "md",
    trackColor: "#0A092D",
    totalFontSize: "45px",
    totalTextColor: "#ffffff",
    totalSx: {
      fontFamily: "__Ubuntu_294529",
    },
    tooltipSx: {
      display: "hidden",
    },
  };

  const lineArgs = {
    data: [
      {
        id: "id",
        data: [
          {
            x: "2",
            y: "3",
          },
          {
            x: "3",
            y: "4",
          },
          {
            x: "4",
            y: "5",
          },
        ],
      },
      {
        id: "di",
        data: [
          {
            x: "2",
            y: "3",
          },
          {
            x: "2",
            y: "4",
          },
          {
            x: "3",
            y: "5",
          },
        ],
      },
    ],

    height: "full",
    width: "full",
  };
  return (
    <div className="h-full flex justify-center py-10 sm:py-20">
      <div className="flex flex-col gap-10 sm:gap-20">
        <div className="font-bold text-5xl">Nice Work!</div>
        <div className="flex flex-col gap-10">
          <div className="font-bold text-2xl">How you're doing</div>
          <div className="flex flex-col gap-14">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between px-4 py-2 rounded-full font-medium w-[300px] bg-green-400/20 text-green-400">
                <div>Done</div>
                <div>{bodyLength - fails}</div>
              </div>
              <div className="flex justify-between px-4 py-2 rounded-full font-medium w-full bg-amber-500/20 text-amber-500">
                <div>Still learning</div>
                <div>{fails}</div>
              </div>
            </div>
            {isMobile ? (
              <MobileTap
                onClick={() => mobileReset && mobileReset()}
                className="bg-blue-500 px-4 py-3 w-fit rounded-xl self-center"
              >
                Press to continue
              </MobileTap>
            ) : (
              <div className="p-5 text-center">Press Enter to continue</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PractiseSuccess;

// useEffect(() => {
//   if (success) {
//     document.addEventListener("keydown", (e) => {
//       if (e.key === "Enter") {
//         setSuccess(false);
//         setFails(0);
//         setCount(0);
//         setKeys(Object.keys(data.body));
//         setCurrentKey(Object.keys(data.body)[0]);
//       }
//     });
//   } else {
//     document.removeEventListener("keydown", () => console.log("removed"));
//   }
// }, [success]);
