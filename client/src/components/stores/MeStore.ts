import { find, map, split } from "lodash";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Organisation, User } from "api/generated/models";

type MeState = {
  token: string | null;
  workspace: string | null;
  me: User | null;
  organisation: Organisation | null;
};

type MeActions = {
  setToken: (token: string) => void;
  setWorkspace: (workspace: string) => void;
  setMe: (me: User) => void;
  setOrganisation: (organisation: Organisation) => void;
  reset: () => void;
};

const ME_INITIAL_STATE: MeState = {
  token: null,
  workspace: null,
  me: null,
  organisation: null,
};

const useMeStore = create<MeState & MeActions>()(
  persist(
    (set, _get) => ({
      ...ME_INITIAL_STATE,
      setToken: (token) => set({ token }),
      setWorkspace: (workspace) => set({ workspace }),
      setMe: (me) => set({ me }),
      setOrganisation: (organisation) => set({ organisation }),
      reset: () => set(ME_INITIAL_STATE),
    }),
    {
      name: "me-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        workspace: state.workspace,
        me: state.me,
        organisation: state.organisation,
      }),
    },
  ),
);

// for debugging
// useMeStore.subscribe(console.log);

export const role = () => {
  const me = useMeStore.getState().me;
  const organisation = useMeStore.getState().organisation;

  if (!me || !organisation) return undefined;
  const workspace = find(me.workspaces, { organisation: organisation._id });
  return workspace?.role;
};

export const userInitials = (name: string | undefined) => {
  if (!name) return "";
  const initials = map(split(name, " "), (word) => word.charAt(0)).join("");
  return [initials.charAt(0), initials.charAt(initials.length - 1)]
    .filter(Boolean)
    .join("");
};

export { useMeStore };
