import type { FC } from "react";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { useHistory } from "react-router-dom";

import type { SidebarMenuItemsProps } from "../Sidebar/SidebarMenu/SidebarMenuItem";

const UserDrawerMenuItem: FC<SidebarMenuItemsProps> = ({
  icon,
  text,
  link,
  onClick,
}) => {
  const history = useHistory();

  return (
    <MenuItem
      sx={{
        px: 0,
        py: 1,
        borderRadius: 2,

        "&:hover": {
          backgroundColor: "transparent",
        },
      }}
      onClick={() => {
        if (link) {
          history.push(link);
        }
        onClick?.();
      }}
      selected={false}
    >
      <ListItemIcon
        sx={{
          width: 20,
          height: 20,
          justifyContent: "center",
          color: "#646C60",

          "& svg": {
            width: 20,
            height: 20,
          },

          "& svg g [fill], & svg path": {
            fill: "#646C60",
          },
        }}
      >
        {icon}
      </ListItemIcon>
      <ListItemText
        sx={{
          pl: 0.5,
          "& .MuiTypography-root": {
            fontWeight: 600,
            fontSize: 16,
            color: "#4D4D4D",
          },
        }}
      >
        {text}
      </ListItemText>
    </MenuItem>
  );
};

export default UserDrawerMenuItem;
