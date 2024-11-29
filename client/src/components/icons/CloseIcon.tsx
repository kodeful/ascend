import React from "react";
import { SvgIcon, type SvgIconProps } from "@mui/material";

const CloseIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        fill="none"
        {...props}
      >
        <path
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M1 19 19 1M1 1l18 18"
        />
      </svg>
    </SvgIcon>
  );
};

export default CloseIcon;
