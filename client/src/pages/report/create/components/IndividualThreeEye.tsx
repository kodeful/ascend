import type React from "react";
import { Box, Typography } from "@mui/material";

import { Page, SectionHeader } from "./ReportPDF.shared";

// Charts intentionally omitted per request — leave TODO comments where needed
// import Home3EyesViewReportGraph from "pages/home/components/Home3EyesViewReport/Home3EyesViewReportGraph";

type Props = {
  width: number;
  height: number;
};

const IndividualThreeEye: React.FC<Props> = ({ width, height }) => (
  <Page key="ind-3eye" width={width} height={height}>
    <SectionHeader
      title="3-Eye Report"
      subtitle="Global alignment across Self, Peer & Facilitator"
    />
    {/* TODO: insert 3-eye chart (individual global) */}
    {/* <Home3EyesViewReportGraph height={515} /> */}
    <Box sx={{ height: 515, pl: 2 }} />
    <Typography fontSize={12} color="#646C60" mt={1}>
      Interpretation: {/* TODO: derive narrative from 3-eye differences */}
    </Typography>
  </Page>
);

export default IndividualThreeEye;
