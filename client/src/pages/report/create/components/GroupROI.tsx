import type React from "react";
import { Typography } from "@mui/material";

import { mean, Page, SectionHeader } from "./ReportPDF.shared";

type Props = {
  width: number;
  height: number;
  skills: { before: number; latest: number; delta: number }[];
};

const GroupROI: React.FC<Props> = ({ width, height, skills }) => (
  <Page key="group-roi" width={width} height={height}>
    <SectionHeader title="ROI: Return on Leadership Development" />
    <Typography fontSize={13} color="#646C60">
      Measured using pre/post deltas at the group level to quantify
      transformation.{" "}
      <b>
        {(() => {
          const avgDelta = mean(skills.map((s) => s.delta));
          if (avgDelta >= 2)
            return "Strong measurable behavior change—high program ROI";
          if (avgDelta >= 1)
            return "Meaningful gains—solid ROI with room to scale";
          return "Emerging value—reinforce to unlock ROI";
        })()}
      </b>
      . Track leading indicators (manager check-ins, project scope increases) to
      connect behavioral change with business value.
    </Typography>
  </Page>
);

export default GroupROI;
