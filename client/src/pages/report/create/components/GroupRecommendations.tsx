import type React from "react";
import { Chip, Stack } from "@mui/material";

import { groupSuggestion, Page, SectionHeader } from "./ReportPDF.shared";

type Props = {
  width: number;
  height: number;
  skills: { skill: string; latest: number; delta: number }[];
};

const GroupRecommendations: React.FC<Props> = ({ width, height, skills }) => (
  <Page key="group-recs" width={width} height={height}>
    <SectionHeader title="Suggested Focus Areas / Recommendations" />
    <Stack direction="row" flexWrap="wrap" gap={1.2}>
      {skills.map((s) => (
        <Chip
          key={s.skill}
          label={`${s.skill}: ${groupSuggestion(s.latest, s.delta)}`}
        />
      ))}
    </Stack>
  </Page>
);

export default GroupRecommendations;
