import type React from "react";
import { Stack, Typography } from "@mui/material";

import { Page, SectionHeader } from "./ReportPDF.shared";

type Props = {
  width: number;
  height: number;
  lines: string[];
};

const IndividualAIInsights: React.FC<Props> = ({ width, height, lines }) => {
  const items =
    lines.length > 0
      ? lines
      : [
          "🚀 Significant jump in Global Score (+2.7) between A1 and A3 — strong upward momentum maintained.",
          "💡 Confidence gains outpaced skill application, suggesting readiness to take on higher-stakes projects.",
          "📚 Application scores improved steadily, especially in Strategic Thinking (+1.1) — evidence of better decision structuring.",
          "🔄 Slight dip in Adaptability mid-cycle recovered by final assessment — potential resilience growth.",
          "🤝 Peer feedback alignment with self-assessment increased, indicating greater self-awareness.",
        ];

  return (
    <Page key="ind-ai" width={width} height={height}>
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

export default IndividualAIInsights;
