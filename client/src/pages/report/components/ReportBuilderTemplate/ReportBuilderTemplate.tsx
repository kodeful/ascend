import React, { type FC } from "react";
import { Box, ButtonBase, Paper, Stack, Typography } from "@mui/material";

interface ReportBuilderTemplateProps {
  title: string;
}

const ReportBuilderTemplate: FC<ReportBuilderTemplateProps> = ({ title }) => {
  return (
    <Paper
      component={ButtonBase}
      sx={{
        display: "flex",
        flexDirection: "column",
        // height: 83,
        overflow: "hidden",
        width: "100%",
        textAlign: "left",
        alignItems: "flex-start",
      }}
    >
      <Stack width="100%" height={20} bgcolor="#E1D7CB" position="relative">
        <Box
          position="absolute"
          width={24}
          height={24}
          right={7}
          bottom={-10}
          bgcolor="primary.main"
          borderRadius="50%"
        ></Box>
      </Stack>

      <Stack
        px={2}
        py={1}
        height="100%"
        justifyContent="center"
        flex={1}
        width="70%"
      >
        <Typography fontSize={15} fontWeight={600} color="#646C60">
          {title}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default ReportBuilderTemplate;
