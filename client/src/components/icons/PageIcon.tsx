import React from "react";
import { SvgIcon, type SvgIconProps } from "@mui/material";

const PageIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={17}
        height={16}
        fill="none"
        viewBox="0 0 16 16"
        {...props}
      >
        <path d="M4.25 1C3.56 1 3 1.56 3 2.25v11.5c0 .69.56 1.25 1.25 1.25h8.5c.69 0 1.25-.56 1.25-1.25V8.5A2.5 2.5 0 0 0 11.5 6h-1.25A1.25 1.25 0 0 1 9 4.75V3.5A2.5 2.5 0 0 0 6.5 1H4.25Z" />
        <path d="M9.147 1.21c.551.636.854 1.449.853 2.29v1.25c0 .138.112.25.25.25h1.25a3.486 3.486 0 0 1 2.29.853A6.512 6.512 0 0 0 9.146 1.21Z" />
      </svg>
    </SvgIcon>
  );
};

export default PageIcon;
