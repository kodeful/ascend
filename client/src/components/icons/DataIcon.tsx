import React from "react";
import { SvgIcon, type SvgIconProps } from "@mui/material";

const DataIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={22}
        height={21}
        fill="none"
        {...props}
      >
        <path d="M.889 11.334c0-.69.56-1.25 1.25-1.25h.945c.69 0 1.25.56 1.25 1.25v7.5c0 .69-.56 1.25-1.25 1.25H2.14c-.686 0-1.25-.565-1.25-1.25v-7.5ZM17.692 1.333c0-.69.56-1.25 1.25-1.25h.92c.69 0 1.25.56 1.25 1.25v17.5c0 .69-.56 1.25-1.25 1.25h-.92c-.685 0-1.25-.564-1.25-1.25v-17.5ZM12.09 9.183c0-.69.56-1.25 1.25-1.25h.947c.69 0 1.25.56 1.25 1.25v9.65c0 .69-.56 1.25-1.25 1.25h-.947c-.685 0-1.25-.564-1.25-1.25v-9.65ZM6.492 6.333c0-.69.56-1.25 1.25-1.25h.945c.69 0 1.25.56 1.25 1.25v12.5c0 .69-.56 1.25-1.25 1.25h-.945c-.685 0-1.25-.564-1.25-1.25v-12.5Z" />
      </svg>
    </SvgIcon>
  );
};

export default DataIcon;
