import React from "react";
import { SvgIcon, type SvgIconProps } from "@mui/material";

const HomeIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={22}
        height={21}
        fill="none"
        {...props}
      >
        <path d="M10.46 1.836a.764.764 0 0 1 1.08 0l8.855 8.854a.765.765 0 1 0 1.08-1.08L12.62.754a2.293 2.293 0 0 0-3.242 0L.525 9.609a.764.764 0 1 0 1.081 1.08l8.854-8.853Z" />
        <path d="m11 3.457 8.313 8.313.093.088v6.315c0 1.055-.856 1.91-1.91 1.91h-3.44a.764.764 0 0 1-.763-.764v-4.585a.764.764 0 0 0-.764-.764H9.472a.764.764 0 0 0-.764.764v4.585a.764.764 0 0 1-.764.765h-3.44a1.91 1.91 0 0 1-1.91-1.91v-6.316a2.33 2.33 0 0 0 .093-.088L11 3.457Z" />
      </svg>
    </SvgIcon>
  );
};

export default HomeIcon;
