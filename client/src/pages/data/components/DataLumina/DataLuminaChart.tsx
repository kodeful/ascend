import React, { useMemo, type FC } from "react";
import { Grid, Stack, Typography } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { useMetricsMindslinesControllerGetSkills } from "api/generated/metrics-mindslines/metrics-mindslines";
import Counter from "components/Counter/Counter";

interface DataLuminaChartProps {
  reverse?: boolean;
  labels?: boolean;
  email?: string;
}

const DataLuminaChart: FC<DataLuminaChartProps> = ({ email, ...props }) => {
  const { data: skills } = useMetricsMindslinesControllerGetSkills(
    { email },
    {
      query: {
        queryKey: ["metrics-mindslines-skills", email],
      },
    },
  );

  const data = useMemo(() => {
    let choosenSkills = (((skills as unknown as any[]) || [])?.map((skill) => {
      let color = "#A0C705";
      if (skill.completedPercentage > 0.75) {
        color = "#A0C705";
      } else if (skill.completedPercentage > 0.5) {
        color = "#CDDD68";
      } else if (skill.completedPercentage > 0.25) {
        color = "#F1B136";
      } else {
        color = "#EC762E";
      }
      return {
        value: +(skill.completedPercentage * 100).toFixed(1),
        color: color,
        label: skill.skill,
      };
    }) || []) as { value: number; color: string; label: string }[];

    choosenSkills = [
      ...choosenSkills,
      { value: 0, color: "#A0C705", label: "Accommodating" },
      { value: 0, color: "#A0C705", label: "Collaborative" },
      { value: 0, color: "#A0C705", label: "Adaptable" },
      { value: 0, color: "#A0C705", label: "Empathetic" },
      { value: 0, color: "#A0C705", label: "Flexible" },
      { value: 0, color: "#A0C705", label: "Spontaneous" },
      { value: 0, color: "#A0C705", label: "Conceptual" },
      { value: 0, color: "#A0C705", label: "Imaginative" },
      { value: 0, color: "#A0C705", label: "Radical" },
      { value: 0, color: "#A0C705", label: "Sociable" },
      { value: 0, color: "#A0C705", label: "Demonstrative" },
      { value: 0, color: "#A0C705", label: "Logical" },
      { value: 0, color: "#A0C705", label: "Practical" },
      { value: 0, color: "#A0C705", label: "Reliable" },
      { value: 0, color: "#A0C705", label: "Organized" },
      { value: 0, color: "#A0C705", label: "Precise" },
      { value: 0, color: "#A0C705", label: "Methodical" },
      { value: 0, color: "#A0C705", label: "Decisive" },
      { value: 0, color: "#A0C705", label: "Analytical" },
      { value: 0, color: "#A0C705", label: "Self-Disciplined" },
      { value: 0, color: "#A0C705", label: "Persuasive" },
      { value: 0, color: "#A0C705", label: "Direct" },
      { value: 0, color: "#A0C705", label: "Courageous" },
    ].slice(0, 24);

    return choosenSkills;
  }, [skills]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <DataLuminaChartSide data={data.slice(0, 12)} {...props} />
      </Grid>
      <Grid item xs={6}>
        <DataLuminaChartSide data={data.slice(12)} {...props} />
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
