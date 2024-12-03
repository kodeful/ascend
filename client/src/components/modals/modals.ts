import type { FC } from "react";

import AddUserModal from "./add-user-modal/AddUserModal";
import LogoutModal from "./logout-modal/LogoutModal";

export const defaultModals: {
  key: string;
  Component: FC<any>;
  precheck?: () => Promise<boolean>;
}[] = [
  {
    key: "add-user",
    Component: AddUserModal,
  },
  // Logout
  {
    key: "logout",
    Component: LogoutModal,
  },
];
