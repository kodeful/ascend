import React from "react";
import { SvgIcon, type SvgIconProps } from "@mui/material";

const ChatIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={22}
        height={21}
        fill="none"
        {...props}
      >
        <path
          fillRule="evenodd"
          d="M19.446 10.42c.004.103.006.206.006.308 0 4.826-4.248 8.635-9.354 8.635-.799 0-1.576-.093-2.318-.268a6.448 6.448 0 0 1-4.585.885.717.717 0 0 1-.422-1.173c.393-.464.662-1.02.78-1.617.023-.11-.02-.305-.243-.521-1.583-1.54-2.565-3.629-2.565-5.94 0-4.826 4.248-8.635 9.353-8.635.279 0 .554.011.826.034v6.644a1.648 1.648 0 0 0 1.649 1.648h6.873Zm-6.873-8.019c3.273.829 5.862 3.262 6.64 6.371h-6.64V2.401Z"
          clipRule="evenodd"
        />
        <path
          fillRule="evenodd"
          d="M12.566.808c0-.397.328-.725.724-.725 4.37 0 7.965 3.596 7.965 7.966a.728.728 0 0 1-.724.724h-7.965V.808Z"
          clipRule="evenodd"
        />
      </svg>
    </SvgIcon>
  );
};

export default ChatIcon;
