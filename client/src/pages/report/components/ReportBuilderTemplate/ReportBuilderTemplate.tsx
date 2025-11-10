import React, { type FC } from "react";
import { alpha, ButtonBase, Paper, Stack, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";

import PageIcon from "components/icons/PageIcon";

interface ReportBuilderTemplateProps {
  title: string;
  state?: any;
}

const ReportBuilderTemplate: FC<ReportBuilderTemplateProps> = ({
  title,
  state,
}) => {
  const history = useHistory();

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
        "&:hover .page-icon": {
          width: 30,
          height: 30,
          bottom: -13,
          right: 4,
          boxShadow: (theme) =>
            `0px 4px 4px ${alpha(theme.palette.primary.main, 0.25)}`,
        },
      }}
      onClick={() => history.push("/report/create", state)}
    >
      <Stack width="100%" height={20} bgcolor="#E1D7CB" position="relative">
        <Stack
          position="absolute"
          width={24}
          height={24}
          right={7}
          bottom={-10}
          bgcolor="primary.main"
          borderRadius="50%"
          direction="row"
          justifyContent="center"
          alignItems="center"
          className="page-icon"
          sx={{
            transition: "width 100ms, height 100ms, bottom 100ms, right 100ms",
          }}
        >
          <PageIcon
            sx={{
              mt: -0.1,
              width: 16,
              "& path": {
                fill: "#fff",
              },
            }}
          />
        </Stack>
      </Stack>

      <Stack
        px={2}
        py={1}
        pb={3}
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
