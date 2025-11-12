import type React from "react";
import { Box, Typography } from "@mui/material";
import { useFormikContext } from "formik";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { Page, SectionHeader } from "./ReportPDF.shared";

type Props = {
  width: number;
  height: number;
  threeEye: { self: number; peer: number; facilitator: number };
};

const IndividualThreeEye: React.FC<Props> = ({ width, height, threeEye }) => {
  const { values } = useFormikContext() as any;

  // Sample mock data — replace with API later
  const categories = ["Global Score"];
  const self = [threeEye?.self ?? 0];
  const peer = [threeEye?.peer ?? 0];
  const facilitator = [threeEye?.facilitator ?? 0];

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
        data: self,
        color: "#EC762E",
      },
      {
        type: "column",
        name: "Peer evaluation",
        data: peer,
        color: "#F1B136",
      },
      {
        type: "column",
        name: "Facilitator evaluation",
        data: facilitator,
        color: "#AEAC95",
      },
    ],
  };

  return (
    <Page key="ind-3eye" width={width} height={height}>
      <SectionHeader
        title="3-Eye Report"
        subtitle="Global alignment across Self, Peer & Facilitator"
      />
      <Box sx={{ pl: 2 }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Box>
      <Typography fontSize={12} color="#646C60" mt={1}>
        Interpretation: Self and Facilitator scores are closely aligned, with
        Peer evaluation slightly lower — suggesting peers may observe more
        opportunities for growth than self-perception indicates.
      </Typography>
    </Page>
  );
};

export default IndividualThreeEye;
