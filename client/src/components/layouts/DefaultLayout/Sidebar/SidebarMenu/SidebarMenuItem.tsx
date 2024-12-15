import React from "react";
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  Tooltip,
  useTheme,
} from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";

export interface SidebarMenuItemsProps {
  id: string;
  icon: JSX.Element;
  text: string | JSX.Element;
  link?: string;
  tooltip?: boolean;
  onClick?: () => void;
  colors?: {
    active: string;
    activeBackground: string;
    inactive: string;
  };
}

const SidebarMenuItem = ({
  icon,
  text,
  link,
  onClick,
  colors,
  tooltip = false,
}: SidebarMenuItemsProps) => {
  const theme = useTheme();
  const history = useHistory();
  const { pathname } = useLocation();

  const isSelected = Boolean(link && pathname.includes(link));

  return (
    <Tooltip title={tooltip ? text : ""} placement="right">
      <MenuItem
        onClick={() => {
          if (link) {
            history.push(link);
          }
          onClick && onClick();
        }}
        sx={{
          py: 1.5,
          pl: 0,
          mb: 0.5,
          mx: 1,
          borderRadius: 2,
          overflow: "hidden",
          "&.Mui-selected": {
            backgroundColor: colors?.activeBackground || "#F5EFEA",
          },
          "&.Mui-selected:hover": {
            backgroundColor: colors?.activeBackground || "#F5EFEA",
          },
        }}
        selected={isSelected}
      >
        <ListItemIcon
          sx={{
            width: 48,
            justifyContent: "center",
            color: isSelected
              ? colors?.active || theme.palette.primary.main
              : colors?.inactive || "#A09992",
            "& svg g [fill], & svg path": {
              fill: isSelected
                ? colors?.active || theme.palette.primary.main
                : colors?.inactive || "#A09992",
            },
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          sx={{
            color: isSelected
              ? colors?.active || theme.palette.primary.main
              : colors?.inactive || "#A09992",

            "& .MuiTypography-root": {
              fontWeight: 600,
            },
          }}
        >
          {text}
        </ListItemText>
      </MenuItem>
    </Tooltip>
  );
};

export default SidebarMenuItem;
