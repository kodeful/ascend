import React, { type FC } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { useMetricsControllerGetMetricsStatisticsBySkill } from "api/generated/metrics/metrics";

interface HomeGroupSkillGraphProps {
  height: number;
  skill: string;
}

const HomeGroupSkillGraph: FC<HomeGroupSkillGraphProps> = ({
  height,
  skill,
}) => {
  const { data: metrics } = useMetricsControllerGetMetricsStatisticsBySkill(
    {
      skill,
    },
    {
      query: {
        queryKey: ["metrics", "statistics", "by-skill", skill],
      },
    },
  );

  const options: Highcharts.Options = {
    chart: {
      type: "bar",
      height: height,
      marginLeft: 0,
      spacingLeft: 0,
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

      labels: {
        enabled: false,
      },
    },
    legend: {
      align: "left",
      padding: 0,
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
      bar: {
        pointPadding: 0.1,
        borderWidth: 0,
        borderRadius: 5,
        dataLabels: {
          enabled: true, // Show data labels
          color: "#000", // Set label color
          style: {
            textOutline: "none", // Disable text outline
            fontWeight: "bold", // Optional: Make labels bold
          },
        },
      },
    },
    series: [
      {
        type: "bar",
        name: "Peer evaluation",
        // @ts-expect-error
        data: metrics?.peerEvaluations || [],
        color: "#F1B136",
      },
      {
        type: "bar",
        name: "Self-evaluation",
        // @ts-expect-error
        data: metrics?.selfEvaluations || [],
        color: "#EC762E",
      },
      {
        type: "bar",
        name: "Facilitator evaluation",
        // @ts-expect-error
        data: metrics?.facilitatorEvaluations || [],
        color: "#AEAC95",
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default HomeGroupSkillGraph;
