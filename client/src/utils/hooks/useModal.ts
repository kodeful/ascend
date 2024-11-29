import {
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

export type UseModalProps<T> = {
  initialState?: boolean;
  initialContext?: T;
  options?: {
    /* should match Dialog's transition time in order to prevent context flash on Dialog's close */
    contextResetDelay?: number;
  };
};

export type UseModalType<T = unknown> = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  toggle: () => void;
  handleClose: () => Promise<void>;
  handleOpen: (ctx?: T | undefined) => void;
  context: T | undefined;
  setContext: Dispatch<SetStateAction<T | undefined>>;
};

function useModal<T>({
  initialState = false,
  initialContext,
  options,
}: UseModalProps<T> = {}): UseModalType<T> {
  const [isOpen, setIsOpen] = useState(initialState);
  const [context, setContext] = useState(initialContext);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const handleClose = useCallback<UseModalType<T>["handleClose"]>(async () => {
    setIsOpen(false);

    // 225ms is default Dialog transition time
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve(setContext(undefined));
      }, options?.contextResetDelay || 225),
    );
  }, [options?.contextResetDelay]);

  const handleOpen = useCallback((ctx?: T) => {
    setIsOpen(true);
    setContext(ctx);
  }, []);

  return {
    isOpen,
    setIsOpen,
    toggle,
    handleClose,
    handleOpen,
    context,
    setContext,
  };
}

export { useModal };
