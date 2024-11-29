import React from "react";
import { SvgIcon, type SvgIconProps } from "@mui/material";

const LogoutIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={22}
        height={20}
        fill="none"
        viewBox="0 0 22 20"
        {...props}
      >
        <path
          fillRule="evenodd"
          d="M4.846 1.538a1.538 1.538 0 0 0-1.538 1.539v13.846a1.538 1.538 0 0 0 1.538 1.539H11a1.539 1.539 0 0 0 1.539-1.539v-3.846a.77.77 0 1 1 1.538 0v3.846A3.077 3.077 0 0 1 11 20H4.846a3.077 3.077 0 0 1-3.077-3.077V3.077A3.077 3.077 0 0 1 4.846 0H11a3.077 3.077 0 0 1 3.077 3.077v3.846a.769.769 0 1 1-1.538 0V3.077A1.539 1.539 0 0 0 11 1.538H4.846Zm5.16 4.841a.77.77 0 0 1 0 1.088L8.24 9.23h11.22a.77.77 0 0 1 0 1.538H8.242l1.764 1.764a.771.771 0 0 1 .02 1.107.768.768 0 0 1-1.107-.02L5.84 10.544a.77.77 0 0 1 0-1.088L8.918 6.38a.77.77 0 0 1 1.087 0Z"
          clipRule="evenodd"
        />
      </svg>
    </SvgIcon>
  );
};

export default LogoutIcon;
