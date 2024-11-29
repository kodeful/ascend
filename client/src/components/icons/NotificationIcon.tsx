import React from "react";
import { SvgIcon, type SvgIconProps } from "@mui/material";

const NotificationIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={22}
        height={22}
        fill="none"
        viewBox="0 0 22 22"
        {...props}
      >
        <path
          fillRule="evenodd"
          d="M8.16 18.2a.386.386 0 0 1 .385-.437c1.024-.012 3.63-.012 4.654-.012a.4.4 0 0 1 .398.45 2.773 2.773 0 0 1-2.725 2.299 2.751 2.751 0 0 1-2.712-2.3Z"
          clipRule="evenodd"
        />
        <path d="M18.832 16.113H2.972a.93.93 0 0 1-.918-1.247.935.935 0 0 1 .36-.46s2.23-1.67 2.23-7.174a6.231 6.231 0 1 1 12.462 0c0 5.504 2.22 7.164 2.239 7.183a.929.929 0 0 1 .356 1.043.93.93 0 0 1-.888.655h.019Z" />
      </svg>
    </SvgIcon>
  );
};

export default NotificationIcon;
