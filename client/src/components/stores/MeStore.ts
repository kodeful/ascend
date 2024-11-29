import { map, split } from "lodash";
import { create } from "zustand";

// import { PermissionsType } from "./permissions";

type MeState = {
  token: string | null;
  me: any;
};

type MeActions = {
  setToken: (token: string) => void;
  setMe: (me: any) => void;
  reset: () => void;
};

const ME_INITIAL_STATE: MeState = {
  token: null,
  me: null,
};

const useMeStore = create<MeState & MeActions>((set, _get) => ({
  ...ME_INITIAL_STATE,
  setToken: (token) => set({ token }),
  setMe: (me) => set({ me }),
  reset: () => set(ME_INITIAL_STATE),
}));

// for debugging
// useMeStore.subscribe(console.log);

export const userInitials = (name: string) => {
  return map(split(name, " "), (word) => word.charAt(0)).join("") ?? "";
};

export { useMeStore };
