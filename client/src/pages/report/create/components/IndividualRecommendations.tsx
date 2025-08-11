import type React from "react";
import { Chip, Grid, Stack, Typography } from "@mui/material";

import {
  individualSuggestion,
  mean,
  Page,
  SectionHeader,
} from "./ReportPDF.shared";

type Aspect = { begin: number; end: number };
type SkillRow = {
  skill: string;
  aspects: { Knowledge: Aspect; Application: Aspect; Confidence: Aspect };
};

type Props = {
  width: number;
  height: number;
  skills: SkillRow[];
};

const IndividualRecommendations: React.FC<Props> = ({
  width,
  height,
  skills,
}) => {
  const items =
    skills.length > 0
      ? skills
      : [
          {
            skill: "Communication",
            aspects: {
              Knowledge: { begin: 3.2, end: 4.5 },
              Application: { begin: 3.0, end: 4.2 },
              Confidence: { begin: 3.4, end: 4.6 },
            },
          },
          {
            skill: "Decision-Making",
            aspects: {
              Knowledge: { begin: 2.8, end: 3.9 },
              Application: { begin: 3.1, end: 4.1 },
              Confidence: { begin: 3.0, end: 4.0 },
            },
          },
        ];

  return (
    <Page key="ind-recs" width={width} height={height}>
      <SectionHeader title="Suggested Focus Areas / Next Steps" />

      <Grid container rowSpacing={1.5} mt={1}>
        {items.map((s) => {
          const k = s.aspects.Knowledge;
          const a = s.aspects.Application;
          const c = s.aspects.Confidence;
          const latestAvg = mean([k.end, a.end, c.end]);
          const beginAvg = mean([k.begin, a.begin, c.begin]);
          const delta = latestAvg - beginAvg;

          const rec = individualSuggestion(latestAvg, delta);
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
                    Δ {delta >= 0 ? "↑" : "↓"}
                    {Math.abs(delta).toFixed(1)}
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

export default IndividualRecommendations;
