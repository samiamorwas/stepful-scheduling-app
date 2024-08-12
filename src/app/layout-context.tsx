import { type ReactNode, createContext } from "react";

interface StateValue {
  opened: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export interface LayoutContextValue {
  sidebar: StateValue;
  aside: StateValue & {
    setContent: (content: ReactNode) => void;
  };
}

const LayoutContext = createContext<LayoutContextValue>({
  sidebar: {
    opened: false,
    toggle: () => {},
    open: () => {},
    close: () => {},
  },
  aside: {
    opened: false,
    toggle: () => {},
    open: () => {},
    close: () => {},
    setContent: (_) => {},
  },
});

export default LayoutContext;
