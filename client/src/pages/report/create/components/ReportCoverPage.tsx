import type React from "react";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";

import { ReportType } from "api/generated/models";
import AscendIcon from "components/icons/AscendIcon";
import AscendTextIcon from "components/icons/AscendTextIcon";
import { useMeStore, userInitials } from "components/stores/MeStore";

import { Page } from "./ReportPDF.shared";

type Props = {
  width: number;
  height: number;
  values: any;
  learner?: { fullName?: string };
  isGroup: boolean;
  isIndividual: boolean;
  assessmentsIncluded: number;
};

const ReportCoverPage: React.FC<Props> = ({
  width,
  height,
  values,
  learner,
  isGroup,
  isIndividual,
  assessmentsIncluded,
}) => (
  <Page key="cover" width={width} height={height} pt={10} pb={8} px={9}>
    {/* HEADER */}
    <Stack
      direction="row"
      spacing={1.5}
      width="100%"
      alignItems="center"
      justifyContent="center"
    >
      <Stack
        width={35}
        height={35}
        border="1px solid #E1E1E1"
        justifyContent="center"
        alignItems="center"
        borderRadius="10px"
      >
        <AscendIcon />
      </Stack>
      <AscendTextIcon sx={{ width: 98 }} />
    </Stack>

    {/* TITLE */}
    <Stack
      textAlign="center"
      alignItems="center"
      flex={1}
      justifyContent="center"
    >
      {values.title && (
        <Typography fontSize={42} fontWeight={600} color="primary.dark">
          {values.title}
        </Typography>
      )}
      {values.reportType && (
        <Typography fontSize={42} fontWeight={600} color="primary.dark">
          {(values.reportType === "individual-report" ||
            values.reportType === ReportType.Individual_Report) &&
            "Individual Report"}
          {(values.reportType === "group-report" ||
            values.reportType === ReportType.Group_Report) &&
            "Group Report"}
        </Typography>
      )}
      <Box width={42} sx={{ bgcolor: "primary.main", height: "1px", my: 2 }} />
      {values.subtitle && (
        <Typography fontSize={28} fontWeight={600} color="#646C60">
          {values.subtitle}
        </Typography>
      )}

      {/* Snapshot block (spec) */}
      <Stack spacing={0.5} mt={2}>
        <Typography fontSize={13} color="#646C60">
          <b>Company:</b> {useMeStore.getState().organisation?.name}
        </Typography>

        {isGroup && (
          <Typography fontSize={13} color="#646C60">
            <b>Assessments included:</b> {assessmentsIncluded}
          </Typography>
        )}
      </Stack>

      {/* Learner pill for individual */}
      {values.learner && isIndividual && (
        <Stack direction="row" alignItems="center" spacing={1} mt={2}>
          <Avatar
            sx={{
              width: 24,
              height: 24,
              bgcolor: "#EC762E",
              color: "#FFF",
              fontSize: 11,
              lineHeight: 1.2,
              fontWeight: 600,
            }}
          >
            {userInitials(learner?.fullName)}
          </Avatar>
          <Typography fontSize={14} fontWeight={600} color="#646C60">
            {learner?.fullName}
          </Typography>
        </Stack>
      )}
    </Stack>

    {/* FOOTER */}
    <Stack textAlign="center" alignItems="center">
      {values.rangeDate && (
        <Typography fontSize={14} color="#646C60">
          <b>Period:</b> {values.rangeDate}
        </Typography>
      )}
      <Typography fontSize={12} color="#646C60">
        Report generated {dayjs().format("DD MMM, YYYY")}
      </Typography>
    </Stack>
  </Page>
);

export default ReportCoverPage;
