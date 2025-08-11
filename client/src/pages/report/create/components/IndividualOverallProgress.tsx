import type React from "react";
import { Box, Typography } from "@mui/material";

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
}) => (
  <Page key="ind-progress" width={width} height={height}>
    <SectionHeader
      title="Overall Progress Summary"
      subtitle="How your leadership capability evolved across assessments"
    />
    {/* TODO: insert global results line chart */}
    <Box height={280} />
    {(() => {
      const latest = timeline[timeline.length - 1];
      const first = timeline[0];
      const delta = latest.global - first.global;
      const pctImprovement = Math.max(
        0,
        (delta / Math.max(1e-9, first.global)) * 100,
      );
      return (
        <Typography fontSize={13} color="#646C60" mt={1}>
          Results indicate steady growth with notable confidence gains. Latest
          global score: <b>{round1(latest.global)}</b> (Δ{" "}
          {delta >= 0 ? "↑" : "↓"}
          {round1(Math.abs(delta))}). Approx.{" "}
          <b>{Math.round(pctImprovement)}%</b> improvement since first
          assessment.
        </Typography>
      );
    })()}
  </Page>
);

export default IndividualOverallProgress;
