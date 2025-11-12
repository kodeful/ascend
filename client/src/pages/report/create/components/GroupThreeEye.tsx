import type React from "react";
import { Box, Typography } from "@mui/material";
import { useFormikContext } from "formik";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { Page, SectionHeader } from "./ReportPDF.shared";

// If your build uses dynamic imports for highcharts-more, you can add features later.

type Props = {
  width: number;
  height: number;
  // Optional aggregated global scores; if omitted, the chart renders a placeholder
  threeEye: {
    self: number;
    peer: number;
    facilitator: number;
  };
};

const interpretAlignment = (spread: number) => {
  if (spread < 0.5) return "Strong alignment across self, peer & facilitator.";
  if (spread < 1.5) return "Moderate alignment with minor perception gaps.";
  return "Notable misalignment—perceptions differ meaningfully.";
};

const GroupThreeEye: React.FC<Props> = ({ width, height, threeEye }) => {
  const { values } = useFormikContext() as any; // for horizontal layout toggle

  const categories = ["Self", "Peer", "Facilitator"];
  // const palette = ["#EC762E", "#F1B136", "#AEAC95"]; // match other 3-eye charts

  // const points: Highcharts.PointOptionsObject[] = [
  //   { y: 11.1, color: palette[0] },
  //   { y: 10.6, color: palette[1] },
  //   { y: 10.9, color: palette[2] },
  // ];

  const spread =
    Math.max(
      threeEye?.self ?? 0,
      threeEye?.peer ?? 0,
      threeEye?.facilitator ?? 0,
    ) -
    Math.min(
      threeEye?.self ?? 0,
      threeEye?.peer ?? 0,
      threeEye?.facilitator ?? 0,
    );

  const options: Highcharts.Options = {
    chart: {
      type: "column",
      height: values.horizontal ? 350 : 515,
      spacing: [0, 0, 0, 0],
    },
    credits: { enabled: false },
    title: { text: "" },
    xAxis: {
      categories,
      labels: { style: { fontSize: "12px" } },
      lineWidth: 0,
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
      column: {
        borderRadius: 5,
        pointPadding: 0.1,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          style: { textOutline: "none", fontWeight: "bold" },
        },
      },
    },
    series: [
      {
        type: "column",
        name: "Self-evaluation",
        data: [threeEye?.self ?? 0],
        color: "#EC762E",
      },
      {
        type: "column",
        name: "Peer evaluation",
        data: [threeEye?.peer ?? 0],
        color: "#F1B136",
      },
      {
        type: "column",
        name: "Facilitator evaluation",
        data: [threeEye?.facilitator ?? 0],
        color: "#AEAC95",
      },
    ],
  };

  return (
    <Page key="group-3eye" width={width} height={height}>
      <SectionHeader title="3-Eye View: Self, Peer & Facilitator" />
      <Typography fontSize={13} color="#646C60" mb={1}>
        Aggregated global perspective (all skills combined)
      </Typography>

      {/* 3-eye chart (group global) */}
      <Box sx={{ pl: 2 }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Box>

      <Typography fontSize={12} color="#646C60" mt={1}>
        Interpretation: {interpretAlignment(spread)}
      </Typography>
    </Page>
  );
};

export default GroupThreeEye;
