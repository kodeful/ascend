import type { FC } from "react";

import LogoutModal from "./AuthModals/LogoutModal";
import ImportDisconnectModal from "./ImportModals/ImportDisconnectModal";
import ImportFileModal from "./ImportModals/ImportFileModal";
import AddOrganizationModal from "./OrganizationModals/AddOrganizationModal";
import AddUserModal from "./UserModals/AddUserModal";
import EditUserModal from "./UserModals/EditUserModal";

export const defaultModals: {
  key: string;
  Component: FC<any>;
  precheck?: () => Promise<boolean>;
}[] = [
  // User
  {
    key: "user-add",
    Component: AddUserModal,
  },
  {
    key: "user-edit",
    Component: EditUserModal,
  },
  // Import
  {
    key: "import-file",
    Component: ImportFileModal,
  },
  {
    key: "import-disconnect",
    Component: ImportDisconnectModal,
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
