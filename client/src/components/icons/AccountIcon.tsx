import React from "react";
import { SvgIcon, type SvgIconProps } from "@mui/material";

const AccountIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={21}
        height={22}
        fill="none"
        {...props}
      >
        <path
          fillRule="evenodd"
          d="M6.214 5.286a4.286 4.286 0 1 1 8.572 0 4.286 4.286 0 0 1-8.572 0Zm-3.57 13.433a7.857 7.857 0 0 1 15.712 0 .715.715 0 0 1-.416.662A17.793 17.793 0 0 1 10.5 21c-2.653 0-5.174-.58-7.44-1.62a.714.714 0 0 1-.416-.661Z"
          clipRule="evenodd"
        />
      </svg>
    </SvgIcon>
  );
};

export default AccountIcon;
