import React, { useMemo, type FC } from "react";
import { Grid, Stack, Typography } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { useMetricsLuminaControllerGetSkills } from "api/generated/metrics-lumina/metrics-lumina";
import Counter from "components/Counter/Counter";

interface DataLuminaChartProps {
  reverse?: boolean;
  labels?: boolean;
  email?: string;
}

const DataLuminaChart: FC<DataLuminaChartProps> = ({ email, ...props }) => {
  const { data: skills } = useMetricsLuminaControllerGetSkills(
    { email },
    {
      query: {
        queryKey: ["metrics", "lumina", email],
      },
    },
  );

  const data = useMemo(() => {
    if (!skills?.length)
      return [
        { value: 0, color: "#A0C705", label: "Adapting to Change" },
        { value: 0, color: "#A0C705", label: "Agile Learning" },
        { value: 0, color: "#A0C705", label: "Conceptualising Strategies" },
        { value: 0, color: "#A0C705", label: "Fostering Creativity" },
        { value: 0, color: "#A0C705", label: "Working under Pressure" },
        { value: 0, color: "#A0C705", label: "Engaging and Energising" },
        { value: 0, color: "#A0C705", label: "Providing Direction" },
        { value: 0, color: "#A0C705", label: "Purposeful Argumentation" },
        { value: 0, color: "#A0C705", label: "Pursuing and Achieving Goals" },
        { value: 0, color: "#A0C705", label: "Planning and Organising" },
        { value: 0, color: "#A0C705", label: "Ensuring Accountability" },
        {
          value: 0,
          color: "#A0C705",
          label: "Gathering and Analysing Information",
        },
        { value: 0, color: "#A0C705", label: "Supporting Others" },
        { value: 0, color: "#A0C705", label: "Coaching and Developing Others" },
        { value: 0, color: "#A0C705", label: "Working Together" },
        { value: 0, color: "#A0C705", label: "Being Interpersonally Astute" },
      ];

    const choosenSkills =
      // @ts-ignore
      (skills ?? []).map((skill: any) => {
        let color = "#A0C705";
        if (skill.percentile > 75) {
          color = "#A0C705";
        } else if (skill.percentile > 50) {
          color = "#CDDD68";
        } else if (skill.percentile > 25) {
          color = "#F1B136";
        } else {
          color = "#EC762E";
        }
        return {
          value: +skill.percentile.toFixed(1),
          color: color,
          label: skill.skill,
        };
      }) || [];

    return choosenSkills;
  }, [skills]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <DataLuminaChartSide data={data.slice(0, 8)} {...props} />
      </Grid>
      <Grid item xs={6}>
        <DataLuminaChartSide data={data.slice(8)} {...props} />
      </Grid>
    </Grid>
  );
};

const DataLuminaChartSide: FC<
  DataLuminaChartProps & {
    data: { value: number; color: string; label: string }[];
  }
> = ({
  reverse = false,
  labels = true,
  // email,
  data,
}) => {
  const options: Highcharts.Options = {
    chart: {
      type: "bar", // Horizontal bars
      height: 290, // Adjust height as needed
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
      max: 100, // Always enforce 100% as the maximum
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
      <Stack width={labels ? 240 : 40}>
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
