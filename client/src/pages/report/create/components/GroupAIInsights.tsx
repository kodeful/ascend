import type React from "react";
import { Stack, Typography } from "@mui/material";

import { Page, SectionHeader } from "./ReportPDF.shared";

type Props = {
  width: number;
  height: number;
  insights: string[];
};

const GroupAIInsights: React.FC<Props> = ({ width, height, insights }) => {
  const items = insights;
  return (
    <Page key="group-ai" width={width} height={height}>
      <SectionHeader title="AI-Generated Insights" />
      <Stack spacing={0.8} mt={1}>
        {items.map((line, i) => (
          <Typography
            key={i}
            fontSize={13}
            color="#646C60"
            sx={{ display: "flex", alignItems: "flex-start" }}
          >
            •&nbsp;{line}
          </Typography>
        ))}
      </Stack>
    </Page>
  );
};

export default GroupAIInsights;
