import React, { type FC } from "react";
import { Stack } from "@mui/material";

import type { WithChildren } from "utils/types";

import SettingsSidebar from "./components/SettingsSidebar";

const SettingsPageLayout: FC<WithChildren<{}>> = ({ children }) => {
  return (
    <Stack direction="row" height="100%">
      <SettingsSidebar />

      {children}
    </Stack>
  );
};

export default SettingsPageLayout;
