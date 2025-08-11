import type React from "react";
import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import { useFormikContext } from "formik";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import {
  interpretScoreMeaning,
  mean,
  Page,
  pct,
  round1,
  SectionHeader,
  trendFromDelta,
} from "./ReportPDF.shared";

type Props = {
  width: number;
  height: number;
  skills: {
    skill: string;
    before: number;
    latest: number;
    delta: number;
    improvedShare: number;
  }[];
  horizontal?: boolean;
};

const GroupEvaluationAssessments: React.FC<Props> = ({
  width,
  height,
  skills,
  horizontal,
}) => {
  const { values } = useFormikContext() as any;

  const categories = skills.map((s) => s.skill);
  const latestScores = skills.map((s) => round1(s.latest));

  const chartOptions: Highcharts.Options = {
    chart: {
      type: "column",
      height: 280,
      // width: 260,
      backgroundColor: "transparent",
      spacingLeft: 0,
      spacingRight: 0,
    },
    credits: { enabled: false },
    title: { text: "" },
    xAxis: {
      categories,
      labels: {
        style: { fontSize: "11px", color: "#646C60" },
        rotation: -35,
      },
      lineColor: "#ddd",
      tickLength: 0,
    },
    yAxis: {
      min: 0,
      title: { text: "" },
      gridLineColor: "#f0f0f0",
      labels: { style: { fontSize: "10px", color: "#888" } },
    },
    legend: { enabled: false },
    tooltip: {
      pointFormat: `<b>{point.y}</b> latest score`,
    },
    plotOptions: {
      column: {
        borderRadius: 3,
        pointPadding: 0.1,
        groupPadding: 0.05,
        dataLabels: {
          enabled: true,
          style: { fontSize: "10px", fontWeight: "bold" },
        },
      },
    },
    series: [
      {
        type: "column",
        name: "Avg Latest Score",
        data: latestScores,
        color: "#EC762E",
      },
    ],
  };

  return (
    <Page key="group-eval" width={width} height={height}>
      <SectionHeader
        title="Evaluation Assessments"
        subtitle="Where change is happening across the cohort"
      />
      <Stack direction="row" spacing={4} sx={{ height: "100%" }}>
        {/* Left: Chart + % improved */}
        <Box flex={1}>
          <Typography fontSize={13} color="#646C60" mb={1}>
            Average score by skill (latest across all completed assessments)
          </Typography>
          <Box
            sx={{
              ...(!values.horizontal && {
                transform: "rotate(90deg)",
                pt: 3,
                boxSizing: "content-box",
              }),
            }}
          >
            <HighchartsReact
              key={values.horizontal ? "horizontal" : "vertical"}
              highcharts={Highcharts}
              options={chartOptions}
            />
          </Box>

          <Typography fontSize={13} color="#646C60" mt={2}>
            % of individuals who improved per skill
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1.2} mt={1.2}>
            {skills.map((s) => (
              <Chip
                key={s.skill}
                label={`${s.skill}: ${pct(s.improvedShare * 100)}`}
                size="small"
                sx={{ bgcolor: "rgba(0,0,0,0.04)" }}
              />
            ))}
          </Stack>
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* Right: Interpretation */}
        <Box flex={1.1}>
          <Typography fontSize={13} color="#646C60" mb={1}>
            Score Interpretation + Meaning (auto-mapped)
          </Typography>

          <Stack spacing={1.2}>
            {skills.slice(0, horizontal ? 4 : 6).map((s) => (
              <Stack
                key={s.skill}
                spacing={0.2}
                sx={{
                  p: 1,
                  borderRadius: 1,
                  bgcolor: "rgba(0,0,0,0.02)",
                }}
              >
                <Typography fontSize={13} fontWeight={600} color="primary.dark">
                  {s.skill}
                </Typography>
                <Typography fontSize={12} color="#646C60">
                  Latest: <b>{round1(s.latest)}</b> ({s.delta >= 0 ? "↑" : "↓"}
                  {round1(Math.abs(s.delta))}) • Trend:{" "}
                  {trendFromDelta(s.delta)}
                </Typography>
                <Typography fontSize={12} color="#646C60">
                  Meaning: {interpretScoreMeaning(s.latest)}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Box mt={2}>
            <Typography fontSize={13} color="#646C60" fontWeight={600}>
              Group Transformation Score
            </Typography>
            <Typography fontSize={13} color="#646C60">
              Avg Global Score Delta (After – Before):{" "}
              <b>{round1(mean(skills.map((s) => s.latest - s.before)))}</b>
              &nbsp;•&nbsp;
              <i>
                {(() => {
                  const val = mean(skills.map((s) => s.latest - s.before));
                  if (val >= 2) return "High transformation";
                  if (val >= 1) return "Moderate transformation";
                  return "Early signs of change";
                })()}
              </i>
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Page>
  );
};

export default GroupEvaluationAssessments;
