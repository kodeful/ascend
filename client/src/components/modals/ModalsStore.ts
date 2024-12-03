import type { FC } from "react";
import { cloneDeep, delay } from "lodash";
import { create } from "zustand";

import { defaultModals } from "./modals";

type ModalsState = {
  modals: {
    key: string;
    Component: FC;
    // precheck?: () => Promise<boolean>;
    open: boolean;
    params: any;
  }[];
};

type ModalsActions = {
  openModal: (key: string, params?: any) => void;
  closeModal: (key: string) => void;
};

const MODALS_INITIAL_STATE: ModalsState = {
  modals:
    defaultModals.map((modal) => ({
      ...modal,
      open: false,
      params: {},
    })) ?? [],
};

const useModalsStore = create<ModalsState & ModalsActions>((set, get) => ({
  ...MODALS_INITIAL_STATE,
  openModal: (key, params) => {
    const modals = cloneDeep(get().modals);

    const modalIndex = modals.findIndex((d) => d.key === key);
    if (modalIndex !== -1) {
      modals[modalIndex].open = true;
      modals[modalIndex].params = params;
    }

    // const modalPrecheck = modals[modalIndex].precheck;
    // if ((await modalPrecheck?.()) === false) {
    //   return;
    // }

    set({ modals });
  },
  closeModal: (key) => {
    const modals = cloneDeep(get().modals);

    const modalIndex = modals.findIndex((d) => d.key === key);

    if (modalIndex !== -1) {
      modals[modalIndex].open = false;
      delay(() => {
        modals[modalIndex].params = {};
      }, 300);
    }

    set({ modals });
  },
}));

// for debugging
// useModalsStore.subscribe(console.log);

export { useModalsStore };

export const openModal = useModalsStore.getState().openModal;
export const closeModal = useModalsStore.getState().closeModal;
