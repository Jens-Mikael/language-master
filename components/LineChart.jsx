import { Line } from "@nivo/line";
import { data } from "@/chartData";

const LineChart = () => {
  return (
    <div className="w-full h-full">
      <Line
        data={data}
        height="700"
        width="700"
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        yFormat=" >-.2f"
        curve="catmullRom"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        theme={{
          textColor: "white",
          fontSize: "14",
          axis: {
            domain: {
              line: {
                stroke: "#ffffff",
                opacity: "1",
              },
            },
            ticks: {
              line: {
                stroke: "#ffffff",
              },
            },
          },
          tooltip: {
            container: {
              textColor: "#000000",
              fill: "#000000"
            },
            tableCell: {
              textColor: "#000000",
              fill: "#000000"
            }
          },
          crosshair: {
            stroke: "#ffffff"
          }
        }}
        enableGridX={false}
        enableGridY={false}
        colors={{ scheme: "category10" }}
        pointSize={10}
        pointColor={{ from: "color", modifiers: [] }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabel="y"
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[]}
      />
    </div>
  );
};

export default LineChart;
