import React, { type FC } from "react";
import { ChevronRight } from "@mui/icons-material";
import { Link, Stack, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Link as RouteLink } from "react-router-dom";

interface TitleProps {
  title: string;
  breadcrumbs?: { title: string; link: string }[];
}

const Title: FC<TitleProps> = ({ title, breadcrumbs }) => {
  return (
    <Stack direction="row" alignItems="flex-end" spacing={3}>
      <Typography variant="h1" color="primary.main">
        {/* {title} */}
        <FormattedMessage id={title} />
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        divider={
          <ChevronRight
            sx={{
              color: "#808080",
              fontSize: 18,
            }}
          />
        }
        pb={0.5}
      >
        {breadcrumbs?.map((breadcrumb) => (
          <Link
            key={breadcrumb.title}
            to={breadcrumb.link}
            component={RouteLink}
            fontSize={14}
            fontWeight={400}
            color="#808080"
            sx={{
              textDecoration: "none",
            }}
          >
            {breadcrumb.title}
          </Link>
        ))}
      </Stack>
    </Stack>
  );
};

export default Title;
