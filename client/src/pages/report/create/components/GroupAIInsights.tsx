import type React from "react";
import { Stack, Typography } from "@mui/material";

import { Page, SectionHeader } from "./ReportPDF.shared";

type Props = {
  width: number;
  height: number;
  insights: string[];
};

const GroupAIInsights: React.FC<Props> = ({ width, height, insights }) => (
  <Page key="group-ai" width={width} height={height}>
    <SectionHeader title="AI-Generated Insights" />
    <Stack spacing={0.6}>
      {insights.map((line, i) => (
        <Typography key={i} fontSize={13} color="#646C60">
          • {line}
        </Typography>
      ))}
      {/* TODO: compute insights directly from cohort deltas and time windows */}
    </Stack>
  </Page>
);

export default GroupAIInsights;
