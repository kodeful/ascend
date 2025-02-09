import { type FC } from "react";
import { AddCircleOutlined } from "@mui/icons-material";
import {
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import { useOrganisationControllerGetOrganisations } from "api/generated/organisation/organisation";
import AsyncComponent from "components/AsyncComponent/AsyncComponent";
import { openModal } from "components/modals/ModalsStore";
import { useMeStore } from "components/stores/MeStore";

type UserPopoverWorkspaceProps = {
  anchorEl: null | HTMLElement;
  isOpen: boolean;
  handleClose: () => void;
};

const UserPopoverWorkspace: FC<UserPopoverWorkspaceProps> = ({
  anchorEl,
  isOpen,
  handleClose,
}) => {
  const { data: organizations, isLoading } =
    useOrganisationControllerGetOrganisations({
      query: {
        queryKey: ["organization"],
      },
    });

  return (
    <Popover
      open={isOpen}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      sx={{
        ml: 0.5,

        "& .MuiPopover-paper": {
          border: "none",
          borderRadius: 2,
          boxShadow: "0px 4px 4px 0px  #00000040",
        },
      }}
    >
      <Stack width={225}>
        <Stack
          sx={{ m: 0.5, p: 0.5, px: 1 }}
          direction="row"
          spacing={0.5}
          alignItems="center"
        >
          <Typography fontSize={14} fontWeight={600} color="#334155">
            Organizations
          </Typography>
        </Stack>

        <Divider sx={{ opacity: 0.3 }} />

        <Stack sx={{ my: 0.5, mx: 0.5 }} direction="column" spacing={0.5}>
          <AsyncComponent
            loading={isLoading}
            SkeletonComponent={
              <>
                <Skeleton variant="rounded" height={32} />
                <Skeleton variant="rounded" height={32} />
                <Skeleton variant="rounded" height={32} />
              </>
            }
          >
            {organizations?.map((organization) => {
              // const isSelected = organization._id === workspace;

              return (
                <MenuItem
                  key={organization._id}
                  sx={{
                    py: 0.5,
                    pl: 0,
                    mx: 0.5,
                    borderRadius: 1,
                    overflow: "hidden",
                    transition: "background-color 150ms ease-in-out",

                    "&:hover": {
                      backgroundColor: "grey.200",
                    },
                  }}
                  onClick={() => {
                    if (useMeStore.getState().workspace === organization._id) {
                      handleClose();
                      return;
                    }

                    useMeStore.getState().setWorkspace(organization._id);
                    window.location.reload();
                  }}
                >
                  <ListItemIcon
                    sx={{
                      width: 32,
                      justifyContent: "center",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 20,
                        height: 20,
                        fontSize: 14,
                        fontWeight: 600,
                        bgcolor: "transparent",
                        color: "primary.main",
                        border: "2px solid transparent",
                        borderColor: "primary.main",
                      }}
                      variant="rounded"
                    >
                      {organization.name.charAt(0)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    sx={{
                      "& .MuiTypography-root": {
                        color: "#333333",
                        fontSize: 13,
                        fontWeight: 500,
                      },
                    }}
                  >
                    {organization.name}
                  </ListItemText>
                </MenuItem>
              );
            })}
          </AsyncComponent>
        </Stack>

        <Divider sx={{ opacity: 0.3 }} />

        <Stack sx={{ my: 0.5 }}>
          <MenuItem
            sx={{
              py: 0.5,
              pl: 0,
              mx: 0.5,
              borderRadius: 1,
              overflow: "hidden",
              transition: "background-color 150ms ease-in-out",

              "&:hover": {
                backgroundColor: "grey.200",
              },
            }}
            onClick={() => {
              openModal("organization-add");
              handleClose();
            }}
          >
            <ListItemIcon
              sx={{
                width: 32,
                justifyContent: "center",
                color: "brandText.secondary",
              }}
            >
              <AddCircleOutlined
                sx={{
                  color: "#AEAC95",
                }}
              />
            </ListItemIcon>
            <ListItemText
              sx={{
                "& .MuiTypography-root": {
                  color: "#333333",
                  fontSize: 13,
                  fontWeight: 500,
                },
              }}
            >
              Add organization
            </ListItemText>
          </MenuItem>
        </Stack>
      </Stack>
    </Popover>
  );
};

export default UserPopoverWorkspace;
