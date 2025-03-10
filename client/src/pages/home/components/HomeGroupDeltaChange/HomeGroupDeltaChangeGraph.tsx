import React, { type FC } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { useMetricsControllerGetMetricsStatisticsByMetric } from "api/generated/metrics/metrics";

interface HomeGroupDeltaChangeGraphProps {
  height: number;
}

const HomeGroupDeltaChangeGraph: FC<HomeGroupDeltaChangeGraphProps> = ({
  height,
}) => {
  const { data: metrics } = useMetricsControllerGetMetricsStatisticsByMetric({
    query: {
      queryKey: ["metrics", "statistics", "by-metric"],
    },
  });

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
      categories: ["Knowledge", "Confidence", "Application"],
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
        name: "After",
        // @ts-expect-error
        data: metrics?.after || [],
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
        name: "Before",
        // @ts-expect-error
        data: metrics?.before || [],
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
