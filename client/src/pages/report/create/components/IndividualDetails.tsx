import type React from "react";
import { Chip, Grid, Stack, Typography } from "@mui/material";

import {
  individualSuggestion,
  mean,
  Page,
  round1,
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
  horizontal?: boolean;
};

const IndividualDetails: React.FC<Props> = ({
  width,
  height,
  skills,
  horizontal,
}) => (
  <Page key="ind-details" width={width} height={height}>
    <SectionHeader
      title="Detailed Results by Skill"
      subtitle="Green = Strength, Yellow = Growth, Red = Focus Area"
    />
    <Stack spacing={1.2} mt={1}>
      {skills.slice(0, horizontal ? 4 : 6).map((s) => {
        const k = s.aspects.Knowledge;
        const a = s.aspects.Application;
        const c = s.aspects.Confidence;
        const latestAvg = mean([k.end, a.end, c.end]);
        const beginAvg = mean([k.begin, a.begin, c.begin]);
        const delta = latestAvg - beginAvg;
        const suggestion = individualSuggestion(latestAvg, delta);
        const tone = suggestion.startsWith("🟢")
          ? "#E6F4EA"
          : suggestion.startsWith("🔴")
            ? "#FDECEA"
            : "#FFF8E1";

        return (
          <Stack
            key={s.skill}
            spacing={0}
            sx={{
              p: 1.2,
              borderRadius: 1,
              bgcolor: tone,
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <Stack direction="row" alignItems="center" gap={1}>
              <Typography fontSize={13} fontWeight={700} color="primary.dark">
                {s.skill}
              </Typography>
              <Stack direction="row" alignItems="center" gap={1}>
                <Chip label={suggestion} size="small" />
              </Stack>
            </Stack>
            <Grid container spacing={1} mt={0.5}>
              <Grid item xs={6}>
                <Typography fontSize={12} color="#646C60">
                  Knowledge — {k.begin} → <b>{k.end}</b> (Δ{" "}
                  {round1(k.end - k.begin)})
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontSize={12} color="#646C60">
                  Application — {a.begin} → <b>{a.end}</b> (Δ{" "}
                  {round1(a.end - a.begin)})
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontSize={12} color="#646C60">
                  Confidence — {c.begin} → <b>{c.end}</b> (Δ{" "}
                  {round1(c.end - c.begin)})
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontSize={12} color="#646C60">
                  Avg Δ: {round1(delta)}
                </Typography>
              </Grid>
            </Grid>
          </Stack>
        );
      })}
    </Stack>
  </Page>
);

export default IndividualDetails;
