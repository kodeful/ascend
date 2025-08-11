import type React from "react";
import { Box, Typography } from "@mui/material";

import { Page, SectionHeader } from "./ReportPDF.shared";

// Charts intentionally omitted per request — leave TODO comments where needed
// import Home3EyesViewReportGraph from "pages/home/components/Home3EyesViewReport/Home3EyesViewReportGraph";

type Props = {
  width: number;
  height: number;
};

const GroupThreeEye: React.FC<Props> = ({ width, height }) => (
  <Page key="group-3eye" width={width} height={height}>
    <SectionHeader title="3-Eye View: Self, Peer & Facilitator" />
    <Typography fontSize={13} color="#646C60" mb={1}>
      Aggregated global perspective (all skills combined)
    </Typography>
    {/* TODO: insert 3-eye chart (group global) */}
    {/* <Home3EyesViewReportGraph height={515} /> */}
    <Box sx={{ height: 515, pl: 2 }} />
    <Typography fontSize={12} color="#646C60" mt={1}>
      Interpretation: {/* TODO: map 3-eye alignment to matrix narrative */}
    </Typography>
  </Page>
);

export default GroupThreeEye;
