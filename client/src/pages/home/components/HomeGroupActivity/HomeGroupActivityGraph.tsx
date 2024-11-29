import React, { type FC } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface HomeGroupActivityGraphProps {
  height: number;
}

const HomeGroupActivityGraph: FC<HomeGroupActivityGraphProps> = ({
  height,
}) => {
  const options: Highcharts.Options = {
    chart: {
      type: "column",
      height: height,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "", // No chart title
    },
    xAxis: {
      categories: ["M", "T", "W", "T", "F", "S", "S"],
      crosshair: false,
      lineWidth: 0,
    },
    yAxis: {
      min: 0, // Start y-axis at 0
      title: {
        text: "",
      },

      labels: {
        enabled: false,
      },
    },

    plotOptions: {
      column: {
        pointPadding: 0,
        borderWidth: 0,
        borderRadius: 5,
      },
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        type: "column",
        name: "Data",
        data: [5, 10, 8, 4, 6, 2, 2],
        color: "#AEAC95",
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default HomeGroupActivityGraph;
