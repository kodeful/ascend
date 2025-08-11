import type React from "react";
import { Chip, Grid, Stack, Typography } from "@mui/material";

import { groupSuggestion, Page, SectionHeader } from "./ReportPDF.shared";

type Props = {
  width: number;
  height: number;
  skills: { skill: string; latest: number; delta: number }[];
};

const GroupRecommendations: React.FC<Props> = ({ width, height, skills }) => {
  // fallback sample data
  const items =
    skills.length > 0
      ? skills
      : [
          { skill: "Communication", latest: 12.4, delta: 1.8 },
          { skill: "Decision-Making", latest: 10.1, delta: 0.6 },
          { skill: "Strategic Thinking", latest: 8.9, delta: -0.4 },
          { skill: "Self-Awareness", latest: 13.0, delta: 2.1 },
          { skill: "Critical Thinking", latest: 9.6, delta: 0.9 },
          { skill: "Adaptability", latest: 8.2, delta: -0.2 },
        ];

  return (
    <Page key="group-recs" width={width} height={height}>
      <SectionHeader title="Suggested Focus Areas / Recommendations" />

      <Grid container rowSpacing={1.5} mt={1}>
        {items.map((s) => {
          const rec = groupSuggestion(s.latest, s.delta);
          let bg = "#FFF8E1";
          if (rec.startsWith("🟢")) bg = "#E6F4EA";
          if (rec.startsWith("🔴")) bg = "#FDECEA";

          return (
            <Grid item xs={12} key={s.skill}>
              <Stack
                spacing={0.5}
                sx={{
                  p: 1.2,
                  borderRadius: 1,
                  bgcolor: bg,
                  border: "1px solid rgba(0,0,0,0.06)",
                  height: "100%",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Chip
                    label={s.skill}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      bgcolor: "rgba(0,0,0,0.05)",
                    }}
                  />
                  <Typography fontSize={12} color="#646C60">
                    Latest: {s.latest.toFixed(1)} (Δ {s.delta >= 0 ? "↑" : "↓"}
                    {Math.abs(s.delta).toFixed(1)})
                  </Typography>
                </Stack>
                <Typography fontSize={12} color="#646C60">
                  {rec}
                </Typography>
              </Stack>
            </Grid>
          );
        })}
      </Grid>
    </Page>
  );
};

export default GroupRecommendations;
