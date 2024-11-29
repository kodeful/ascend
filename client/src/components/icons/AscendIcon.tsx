import React from "react";
import { SvgIcon, type SvgIconProps } from "@mui/material";

const AscendIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={18}
        height={22}
        fill="none"
        {...props}
        viewBox="0 0 20 22"
      >
        <path
          fill="#EE4F28"
          fillRule="evenodd"
          d="M14.414 16.96c-.795.868-1.884 2.02-3.013 2.892a6.745 6.745 0 0 1-4.138 1.412 6.779 6.779 0 0 1-6.776-6.776c0-3.74 3.042-6.773 6.781-6.773h.007l.892-.004v3.512h-.903a3.267 3.267 0 1 0 0 6.534c.904 0 1.926-.462 2.545-1.029.534-.49 1.617-1.574 2.26-2.387H8.166v-3.115l6.245-.002h3.304v9.853h-3.3l-.002-4.117ZM10.941 4.441H3.19V.94L10.94.935a6.777 6.777 0 0 1 6.773 6.776h-3.502c0-1.804-1.47-3.27-3.27-3.27Z"
          clipRule="evenodd"
        />
        <path
          fill="#EE4F28"
          fillRule="evenodd"
          d="m14.208 7.712 1.815-.672 1.693.672v1.823h-3.504l-.004-1.823Z"
          clipRule="evenodd"
        />
      </svg>
    </SvgIcon>
  );
};

export default AscendIcon;
