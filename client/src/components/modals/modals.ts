import type { FC } from "react";

import LogoutModal from "./AuthModals/LogoutModal";
import AddOrganizationModal from "./OrganizationModals/AddOrganizationModal";
import AddUserModal from "./UserModals/AddUserModal";
import EditUserModal from "./UserModals/EditUserModal";

export const defaultModals: {
  key: string;
  Component: FC<any>;
  precheck?: () => Promise<boolean>;
}[] = [
  {
    key: "user-add",
    Component: AddUserModal,
  },
  {
    key: "user-edit",
    Component: EditUserModal,
  },
  // Organization
  {
    key: "organization-add",
    Component: AddOrganizationModal,
  },
  // Logout
  {
    key: "logout",
    Component: LogoutModal,
  },
];
