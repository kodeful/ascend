import React, { type FC } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { map, round } from "lodash";
import { useIntl } from "react-intl";

import { useMetricsEvaluationControllerGetByMetric } from "api/generated/metrics-evaluation/metrics-evaluation";

interface HomeGroupDeltaChangeGraphProps {
  height: number;
  email?: string;
}

const HomeGroupDeltaChangeGraph: FC<HomeGroupDeltaChangeGraphProps> = ({
  height,
  email,
}) => {
  const intl = useIntl();
  const { data: metrics } = useMetricsEvaluationControllerGetByMetric(
    { email },
    {
      query: {
        queryKey: ["metrics", "evaluation", "by-metric", email],
      },
    },
  );

  const options: Highcharts.Options = {
    chart: {
      type: "areaspline",
      height: `${height}px`,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: [
        intl.formatMessage({ id: "PAGE.HOME.KNOWLEDGE" }),
        intl.formatMessage({ id: "PAGE.HOME.CONFIDENCE" }),
        intl.formatMessage({ id: "PAGE.HOME.APPLICATION" }),
      ],
      lineWidth: 0,
      startOnTick: false,
      endOnTick: false,
      min: 0.5,
      max: 1.5,
      tickmarkPlacement: "on",
      labels: {
        align: "center",
      },
    },
    yAxis: {
      labels: {
        enabled: false,
      },
      title: {
        text: null,
      },
    },
    legend: {
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
    },
    plotOptions: {
      areaspline: {
        fillOpacity: 0.5,
      },
    },
    series: [
      {
        type: "areaspline",
        name: intl.formatMessage({ id: "PAGE.HOME.AFTER" }),
        // @ts-expect-error
        data: map(metrics?.after || [], (value) => round(value, 1)) || [],
        color: "#EE4F28", // Red for "After"
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "#EE4F2855"], // Start color
            [1, "#EE4F2800"], // End color
          ],
        },
      },
      {
        type: "areaspline",
        name: intl.formatMessage({ id: "PAGE.HOME.BEFORE" }),
        // @ts-expect-error
        data: map(metrics?.before || [], (value) => round(value, 1)) || [],
        color: "#AEAC95", // Gray for "Before"
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "#AEAC9555"], // Start color
            [1, "#AEAC9500"], // End color
          ],
        },
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default HomeGroupDeltaChangeGraph;
