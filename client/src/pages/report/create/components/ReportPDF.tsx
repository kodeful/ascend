import React, { useMemo } from "react";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useFormikContext } from "formik";
import { find } from "lodash";

import { useUserControllerFilterUsers } from "api/generated/user/user";
import AscendIcon from "components/icons/AscendIcon";
import AscendTextIcon from "components/icons/AscendTextIcon";
import { userInitials } from "components/stores/MeStore";

const ReportPDF = () => {
  const { values } = useFormikContext() as any;

  const { width, height } = useMemo(() => {
    if (values.horizontal) {
      return {
        width: 934,
        height: 660,
      };
    }

    return {
      width: 660,
      height: 934,
    };
  }, [values.horizontal]);

  const { data: learners } = useUserControllerFilterUsers(
    {
      limit: -1,
      filter: "role::eq::Learner",
    },
    {
      query: {
        queryKey: ["users", "learner"],
        enabled: values.reportType === "individual-report",
      },
    },
  );

  const learner = useMemo(
    () => find(learners?.data, { _id: values.learner }),
    [learners, values.learner],
  );

  return (
    <Stack mt={3} direction="column" width="100%" alignItems="center">
      {/* STARTING PAGE */}
      <Stack
        position="relative"
        width={width}
        height={height}
        borderRadius={1.5}
        bgcolor="#FFF"
        boxShadow="4px 4px 11.3px 0px #0000000D"
        pt={10}
        pb={8}
        px={9}
        justifyContent="space-between"
        overflow="hidden"
        boxSizing="border-box"
      >
        {/* LOGO */}
        <AscendIcon
          sx={{
            position: "absolute",
            bottom: -15,
            right: -20,
            width: 210,
            height: 249,
            opacity: 0.1,
          }}
        />
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
          <AscendTextIcon
            sx={{
              width: 98,
            }}
          />
        </Stack>

        {/* TITLE */}
        <Stack textAlign="center" alignItems="center">
          {values.title && (
            <Typography fontSize={42} fontWeight={600} color="primary.dark">
              {values.title}
            </Typography>
          )}

          {values.reportType && (
            <Typography fontSize={42} fontWeight={600} color="primary.dark">
              {values.reportType === "individual-report" && "Individual Report"}
              {values.reportType === "group-report" && "Group Report"}
            </Typography>
          )}

          <Box
            width={42}
            sx={{
              bgcolor: "primary.main",
              height: "1px",
              my: 2,
            }}
          />

          {values.subtitle && (
            <Typography fontSize={28} fontWeight={600} color="#646C60">
              {values.subtitle}
            </Typography>
          )}

          {values.learner && (
            <Stack direction="row" alignItems="center" spacing={1} mt={2}>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: "#EC762E",
                  color: "#FFF",
                  fontSize: 11,
                  lineHeight: 1.2,
                  // fontSize: Math.min(40, 60 / initials.length),
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
              <b>Rank date:</b>{" "}
              {values.rangeDate === "last-week" && "Last week"}
            </Typography>
          )}
          <Typography fontSize={12} color="#646C60">
            Report generated {dayjs().format("DD MMM, YYYY")}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ReportPDF;
