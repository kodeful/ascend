import React, { type FC } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { map, round } from "lodash";
import { useIntl } from "react-intl";

import { useMetricsThreeEyeViewControllerGetMetricsStatisticsBySkill } from "api/generated/metrics-three-eye-view/metrics-three-eye-view";

interface HomeGroupSkillGraphProps {
  height: number;
  skill: string;
  email?: string;
}

const HomeGroupSkillGraph: FC<HomeGroupSkillGraphProps> = ({
  height,
  skill,
  email,
}) => {
  const intl = useIntl();

  const { data: metrics } =
    useMetricsThreeEyeViewControllerGetMetricsStatisticsBySkill(
      {
        skill,
        email,
      },
      {
        query: {
          queryKey: ["metrics", "three-eye-view", "by-skill", skill, email],
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
        name: intl.formatMessage({ id: "PAGE.HOME.PEER_EVALUATION" }),
        data:
          // @ts-expect-error
          map(metrics?.peerEvaluations || [], (value) => round(value, 1)) || [],
        color: "#F1B136",
      },
      {
        type: "bar",
        name: intl.formatMessage({ id: "PAGE.HOME.SELF_EVALUATION" }),
        data:
          // @ts-expect-error
          map(metrics?.selfEvaluations || [], (value) => round(value, 1)) || [],
        color: "#EC762E",
      },
      {
        type: "bar",
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

export default HomeGroupSkillGraph;
