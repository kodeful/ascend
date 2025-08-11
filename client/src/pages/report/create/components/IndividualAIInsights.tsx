import type React from "react";
import { Stack, Typography } from "@mui/material";

import { Page, SectionHeader } from "./ReportPDF.shared";

type Props = {
  width: number;
  height: number;
  lines: string[];
};

const IndividualAIInsights: React.FC<Props> = ({ width, height, lines }) => (
  <Page key="ind-ai" width={width} height={height}>
    <SectionHeader title="AI-Generated Insights" />
    <Stack spacing={0.6}>
      {lines.map((line, i) => (
        <Typography key={i} fontSize={13} color="#646C60">
          • {line}
        </Typography>
      ))}
      {/* TODO: compute insights directly from individual deltas and confidence timeline */}
    </Stack>
  </Page>
);

export default IndividualAIInsights;
