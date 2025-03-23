import React, { type FC } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import "highcharts/modules/venn";

// HighchartsMore(Highcharts);
// VennModule(Highcharts);

interface DataGroupMetricsChartProps {
  height: number;
}

const DataGroupMetricsChart: FC<DataGroupMetricsChartProps> = ({ height }) => {
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
    series: [
      {
        type: "venn",
        data: [
          {
            sets: ["A"],
            value: 8,
            name: "Application",
            color: "#EC762E",
            borderWidth: 0,
          },
          {
            sets: ["B"],
            value: 6,
            name: "Confidence",
            color: "#F1B136C2",
            borderWidth: 0,
          },
          {
            sets: ["C"],
            value: 9,
            name: "Knowledge",
            color: "#BEB76DBF",
            borderWidth: 0,
          },
          {
            sets: ["A", "B"],
            value: 6,
            name: "",
            color: "transparent",
            borderWidth: 0,
          }, // Overlap A and B
          {
            sets: ["B", "C"],
            value: 6,
            name: "",
            color: "transparent",
            borderWidth: 0,
          }, // Overlap B and C
          {
            sets: ["A", "C"],
            value: 6,
            name: "",
            color: "transparent",
            borderWidth: 0,
          }, // Overlap A and C
          {
            sets: ["A", "B", "C"],
            value: 6,
            name: "",
            color: "transparent",
            borderWidth: 0,
          }, // Overlap A, B, and C
        ],
        dataLabels: {
          enabled: true,
          format: "{point.value}",
          style: {
            color: "#FFFFFF",
            fontSize: "14px",
            fontWeight: "bold",
            textOutline: "none",
          },
        },
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default DataGroupMetricsChart;
