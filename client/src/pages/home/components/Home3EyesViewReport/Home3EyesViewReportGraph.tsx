import React, { type FC } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface Home3EyesViewReportGraphProps {
  height: number;
}

const Home3EyesViewReportGraph: FC<Home3EyesViewReportGraphProps> = ({
  height,
}) => {
  const options: Highcharts.Options = {
    chart: {
      type: "column",
      height: height,
      spacing: [0, 0, 0, 0],
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "",
    },
    xAxis: {
      lineWidth: 0,
      categories: [
        "Criteria 1",
        "Criteria 2",
        "Criteria 3",
        "Criteria 4",
        "Criteria 5",
        "Criteria 6",
        "Criteria 7",
        "Criteria 8",
        "Criteria 9",
        "Criteria 10",
      ],
      //   crosshair: false,
      labels: {
        enabled: false,
      },
    },
    legend: {
      align: "left",
    },
    yAxis: {
      min: 0, // Start y-axis at 0
      title: {
        text: "", // Y-axis title
      },
      labels: {
        enabled: false,
      },
    },

    plotOptions: {
      column: {
        pointPadding: 0.1,
        borderWidth: 0,
        borderRadius: 5,
        dataLabels: {
          verticalAlign: "bottom",
          y: 300,
          enabled: true,
          color: "#FFF",
          style: {
            textOutline: "none",
            fontWeight: "bold",
          },
        },
      },
    },
    series: [
      {
        type: "column",
        name: "Peer evaluation",
        data: [8, 7, 9, 8, 6, 8, 8, 8, 9, 7],
        color: "#F1B136",
      },
      {
        type: "column",

        name: "Self-evaluation",
        data: [9, 8, 9, 8, 6, 8, 7, 8, 9, 7],
        color: "#EC762E",
      },
      {
        type: "column",

        name: "Facilitator evaluation",
        data: [8, 6, 8, 9, 7, 9, 8, 9, 8, 6],
        color: "#AEAC95",
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default Home3EyesViewReportGraph;
