import type React from "react";
import { Chip, Stack } from "@mui/material";

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
}) => (
  <Page key="ind-recs" width={width} height={height}>
    <SectionHeader title="Suggested Focus Areas / Next Steps" />
    <Stack direction="row" flexWrap="wrap" gap={1.2}>
      {skills.map((s) => {
        const k = s.aspects.Knowledge;
        const a = s.aspects.Application;
        const c = s.aspects.Confidence;
        const latestAvg = mean([k.end, a.end, c.end]);
        const beginAvg = mean([k.begin, a.begin, c.begin]);
        const delta = latestAvg - beginAvg;
        return (
          <Chip
            key={s.skill}
            label={`${s.skill}: ${individualSuggestion(latestAvg, delta)}`}
          />
        );
      })}
    </Stack>
  </Page>
);

export default IndividualRecommendations;
