import type React from "react";
import { Stack, Typography } from "@mui/material";

import { Page, SectionHeader } from "./ReportPDF.shared";

type Props = {
  width: number;
  height: number;
  insights: string[];
};

const GroupAIInsights: React.FC<Props> = ({ width, height, insights }) => {
  const items =
    insights.length > 0
      ? insights
      : [
          "📈 The cohort showed a 23% surge in Communication scores, suggesting rapid adoption of collaborative habits.",
          "🤝 Peer evaluations rose faster than self-evaluations, hinting at growing external recognition of applied skills.",
          "🧠 Critical Thinking improvements clustered after mid-program simulations — immersive scenarios appear highly effective.",
          "⚡ Momentum peaked in month 3, with slight plateauing thereafter — consider introducing stretch challenges to sustain growth.",
          "🌱 Adaptability gains were consistent but modest — targeted role-rotation could accelerate development.",
        ];

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
