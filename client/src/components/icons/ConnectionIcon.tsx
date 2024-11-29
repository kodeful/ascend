import React from "react";
import { SvgIcon, type SvgIconProps } from "@mui/material";

const ConnectionIcon = (props: SvgIconProps) => {
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
          d="M17.991 3.509a3.556 3.556 0 0 0-5.028 0L8.697 7.775a3.555 3.555 0 0 0 .981 5.723.711.711 0 0 1-.612 1.283A4.977 4.977 0 0 1 7.692 6.77l4.266-4.266a4.976 4.976 0 1 1 7.038 7.038l-1.665 1.666a.711.711 0 1 1-1.005-1.005l1.665-1.666a3.557 3.557 0 0 0 0-5.028Zm-7.005 4.045a.711.711 0 0 1 .948-.335 4.977 4.977 0 0 1 1.374 8.011l-4.266 4.266a4.977 4.977 0 1 1-7.038-7.038l1.665-1.666a.711.711 0 1 1 1.005 1.005L3.01 13.463a3.556 3.556 0 0 0 5.028 5.028l4.266-4.266a3.554 3.554 0 0 0-.981-5.723.711.711 0 0 1-.336-.948Z"
          clipRule="evenodd"
        />
      </svg>
    </SvgIcon>
  );
};

export default ConnectionIcon;
