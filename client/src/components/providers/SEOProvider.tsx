import React from "react";
import { useTheme } from "@mui/material";
import { Helmet } from "react-helmet";

const SEO = () => {
  const theme = useTheme();

  return (
    <Helmet
      title={`Ascend`}
      htmlAttributes={{ lang: "en" }}
      meta={[
        {
          name: `description`,
          content: ``,
        },
        {
          name: "theme-color",
          content: theme.palette.primary.main,
        },
      ]}
    />
  );
};

export default SEO;
