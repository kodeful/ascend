import React, { type FC } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { map, round } from "lodash";
import { useIntl } from "react-intl";

import { useMetricsThreeEyeViewControllerGetMetricsStatisticsBySkill } from "api/generated/metrics-three-eye-view/metrics-three-eye-view";

interface Home3EyesViewReportGraphProps {
  height: number;
  email?: string;
}

const Home3EyesViewReportGraph: FC<Home3EyesViewReportGraphProps> = ({
  height,
  email,
}) => {
  const intl = useIntl();
  const { data: metrics } =
    useMetricsThreeEyeViewControllerGetMetricsStatisticsBySkill(
      {
        skill: undefined,
        email,
      },
      {
        query: {
          queryKey: ["metrics", "statistics", "by-skill", email],
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
        name: intl.formatMessage({ id: "PAGE.HOME.PEER_EVALUATION" }),
        data:
          // @ts-expect-error
          map(metrics?.peerEvaluations || [], (value) => round(value, 1)) || [],
        color: "#F1B136",
      },
      {
        type: "column",

        name: intl.formatMessage({ id: "PAGE.HOME.SELF_EVALUATION" }),
        data:
          // @ts-expect-error
          map(metrics?.selfEvaluations || [], (value) => round(value, 1)) || [],
        color: "#EC762E",
      },
      {
        type: "column",

        name: intl.formatMessage({ id: "PAGE.HOME.FACILITATOR_EVALUATION" }),
        data:
          // @ts-expect-error
          map(metrics?.facilitatorEvaluations || [], (value) =>
            round(value, 1),
          ) || [],
        color: "#AEAC95",
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default Home3EyesViewReportGraph;
