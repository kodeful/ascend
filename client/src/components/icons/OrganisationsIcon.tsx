import React from "react";
import { SvgIcon, type SvgIconProps } from "@mui/material";

const OrganisationsIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={18}
        fill="none"
        viewBox="0 0 16 18"
      >
        <path
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 1h8M2.4 4.2h11.2M13.6 7.4H2.4A1.6 1.6 0 0 0 .8 9v6.4A1.6 1.6 0 0 0 2.4 17h11.2a1.6 1.6 0 0 0 1.6-1.6V9a1.6 1.6 0 0 0-1.6-1.6Z"
        />
      </svg>
    </SvgIcon>
  );
};

export default OrganisationsIcon;
