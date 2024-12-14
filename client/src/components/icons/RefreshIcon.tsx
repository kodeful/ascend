import React from "react";
import { SvgIcon, type SvgIconProps } from "@mui/material";

const RefreshIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={13}
        height={12}
        fill="none"
        viewBox="0 0 13 12"
        {...props}
      >
        <path
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.88 4.5H12l-1.988-1.99a5.156 5.156 0 0 0-8.627 2.313m-.654 6.112v-3.12m0 0h3.12m-3.12 0L2.72 9.804a5.156 5.156 0 0 0 8.627-2.313M12 1.38v3.118"
        />
      </svg>
    </SvgIcon>
  );
};

export default RefreshIcon;
