import { create } from "zustand";

type CursorState = {
  mouse: { x: number; y: number };
};

type CursorActions = {
  setMouse: (mouse: { x: number; y: number }) => void;
};

const CURSOR_INITIAL_STATE: CursorState = {
  mouse: { x: 0, y: 0 },
};

const useCursorStore = create<CursorState & CursorActions>((set, _get) => ({
  ...CURSOR_INITIAL_STATE,
  setMouse: (mouse) => set({ mouse }),
}));

// for debugging
// useCursorStore.subscribe(console.log);

export { useCursorStore };
