import { map, split } from "lodash";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { User } from "api/generated/models";

type MeState = {
  token: string | null;
  me: User | null;
};

type MeActions = {
  setToken: (token: string) => void;
  setMe: (me: User) => void;
  reset: () => void;
};

const ME_INITIAL_STATE: MeState = {
  token: null,
  me: null,
};

const useMeStore = create<MeState & MeActions>()(
  persist(
    (set, _get) => ({
      ...ME_INITIAL_STATE,
      setToken: (token: string) => set({ token }),
      setMe: (me: any) => set({ me }),
      reset: () => set(ME_INITIAL_STATE),
    }),
    {
      name: "me-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        me: state.me,
      }),
    },
  ),
);

// for debugging
// useMeStore.subscribe(console.log);

export const userInitials = (name: string) => {
  return map(split(name, " "), (word) => word.charAt(0)).join("") ?? "";
};

export { useMeStore };
