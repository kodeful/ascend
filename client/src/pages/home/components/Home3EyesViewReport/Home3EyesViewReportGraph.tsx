import React, { type FC } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { useMetricsControllerGetMetricsStatisticsBySkill } from "api/generated/metrics/metrics";

interface Home3EyesViewReportGraphProps {
  height: number;
}

const Home3EyesViewReportGraph: FC<Home3EyesViewReportGraphProps> = ({
  height,
}) => {
  const { data: metrics } = useMetricsControllerGetMetricsStatisticsBySkill(
    {
      skill: undefined,
    },
    {
      query: {
        queryKey: ["metrics", "statistics", "by-skill"],
      },
    },
  );

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
      // @ts-expect-error
      categories: metrics?.skills || [],
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
        // @ts-expect-error
        data: metrics?.peerEvaluations || [],
        color: "#F1B136",
      },
      {
        type: "column",

        name: "Self-evaluation",
        // @ts-expect-error
        data: metrics?.selfEvaluations || [],
        color: "#EC762E",
      },
      {
        type: "column",

        name: "Facilitator evaluation",
        // @ts-expect-error
        data: metrics?.facilitatorEvaluations || [],
        color: "#AEAC95",
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default Home3EyesViewReportGraph;
