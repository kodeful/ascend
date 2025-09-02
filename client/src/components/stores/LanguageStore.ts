import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type MeState = {
  language: "en" | "es";
};

type MeActions = {
  setLanguage: (language: "en" | "es") => void;
};

const ME_INITIAL_STATE: MeState = {
  language: "en",
};

const useLanguageStore = create<MeState & MeActions>()(
  persist(
    (set, _get) => ({
      ...ME_INITIAL_STATE,
      setLanguage: (language) => set({ language }),
      reset: () => set(ME_INITIAL_STATE),
    }),
    {
      name: "language-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        language: state.language,
      }),
    },
  ),
);

// for debugging
// useLanguageStore.subscribe(console.log);

export const getLanguageFlag = (language: string) => {
  if (language === "en") return "https://flagcdn.com/gb.svg";
  if (language === "es") return "https://flagcdn.com/es.svg";
  return "";
};

export { useLanguageStore };
