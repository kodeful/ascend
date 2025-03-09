import React, { useMemo, type FC } from "react";
import { Stack, Typography } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import Counter from "components/Counter/Counter";

interface DataLuminaChartProps {
  reverse?: boolean;
  labels?: boolean;
}

const DataLuminaChart: FC<DataLuminaChartProps> = ({
  reverse = false,
  labels = true,
}) => {
  const data = useMemo(() => {
    return [
      { value: 0, color: "#A0C705", label: "Intimate" },
      { value: 0, color: "#A0C705", label: "Accommodating" },
      { value: 0, color: "#A0C705", label: "Collaborative" },
      { value: 0, color: "#A0C705", label: "Adaptable" },
      { value: 0, color: "#A0C705", label: "Empathetic" },
      { value: 0, color: "#CDDD68", label: "Flexible" },
      { value: 0, color: "#F1B136", label: "Spontaneous" },
      { value: 0, color: "#F1B136", label: "Conceptual" },
      { value: 0, color: "#F1B136", label: "Imaginative" },
      { value: 0, color: "#F1B136", label: "Radical" },
      { value: 0, color: "#F1B136", label: "Sociable" },
      { value: 0, color: "#EC762E", label: "Demonstrative" },
    ];
  }, []);

  const options: Highcharts.Options = {
    chart: {
      type: "bar", // Horizontal bars
      height: 430, // Adjust height as needed
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "", // No title
    },
    xAxis: {
      categories: data.map((item) => item.label),
      title: {
        text: null,
      },
      labels: {
        enabled: false,
      },
      lineWidth: 0,
    },
    yAxis: {
      min: 0, // Start at 0
      title: {
        text: "",
      },

      reversed: reverse, // Reverse the graph if reverse is true

      labels: {
        enabled: false,
      },
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        pointPadding: -0.1,
        borderWidth: 0,
        borderRadius: 5,
      },
    },
    series: [
      {
        type: "bar",
        name: "Percentage",
        data: data.map((item) => ({
          y: item.value,
          color: item.color,
        })),
      },
    ],
  };

  return (
    <Stack
      direction="row"
      overflow="hidden"
      flexDirection={reverse ? "row-reverse" : "row"}
    >
      <Stack flex={1} width="100%" overflow="hidden">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Stack>
      <Stack width={labels ? 150 : 40}>
        <Stack direction="column" my={1}>
          {data.map((item) => (
            <Stack
              key={item.label}
              direction="row"
              height={34}
              alignItems="center"
            >
              <Typography
                fontSize={12}
                fontWeight={700}
                color="#646C60"
                width={40}
              >
                <Counter count={item.value} step={1} digits={0} />%
              </Typography>
              {labels && (
                <Typography fontSize={12} color="#646C60">
                  {item.label}
                </Typography>
              )}
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default DataLuminaChart;
