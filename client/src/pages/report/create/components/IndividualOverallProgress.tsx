import type React from "react";
import { Box, Typography } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { Page, round1, SectionHeader } from "./ReportPDF.shared";

type TimelinePoint = {
  label: string;
  date: string;
  global: number;
  confidence: number;
};

type Props = {
  width: number;
  height: number;
  timeline: TimelinePoint[];
};

const IndividualOverallProgress: React.FC<Props> = ({
  width,
  height,
  timeline,
}) => {
  const categories = timeline.map((p) => p.label);
  const globalSeries = timeline.map((p) => round1(p.global));
  const confidenceSeries = timeline.map((p) => round1(p.confidence));

  const options: Highcharts.Options = {
    chart: {
      type: "line",
      height: 280,
      spacing: [0, 0, 0, 0],
    },
    credits: { enabled: false },
    title: { text: "" },
    xAxis: {
      categories,
      lineWidth: 0,
      labels: { style: { fontSize: "12px" } },
    },
    yAxis: {
      min: 0,
      title: { text: "" },
      labels: { enabled: false },
      gridLineWidth: 0,
    },
    legend: {
      align: "center",
      verticalAlign: "bottom",
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
          radius: 4,
          symbol: "circle",
        },
        dataLabels: {
          enabled: true,
          style: { textOutline: "none", fontWeight: "bold" },
        },
      },
    },
    series: [
      {
        type: "line",
        name: "Global Score",
        data: globalSeries,
        color: "#EC762E",
      },
      {
        type: "line",
        name: "Confidence",
        data: confidenceSeries,
        color: "#F1B136",
      },
    ],
  };

  const latest = timeline[timeline.length - 1] ?? { global: 0, confidence: 0 };
  const first = timeline[0] ?? { global: 0, confidence: 0 };
  const delta = latest.global - first.global;
  const pctImprovement = Math.max(
    0,
    (delta / Math.max(100, first.global)) * 100,
  );

  return (
    <Page key="ind-progress" width={width} height={height}>
      <SectionHeader
        title="Overall Progress Summary"
        subtitle="How your leadership capability evolved across assessments"
      />
      <Box>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Box>
      <Typography fontSize={13} color="#646C60" mt={1}>
        Results indicate steady growth with notable confidence gains. Latest
        global score: <b>{round1(latest.global)}</b> (Δ {delta >= 0 ? "↑" : "↓"}
        {round1(Math.abs(delta))}). Approx. <b>{Math.round(pctImprovement)}%</b>{" "}
        improvement since first assessment.
      </Typography>
    </Page>
  );
};

export default IndividualOverallProgress;
