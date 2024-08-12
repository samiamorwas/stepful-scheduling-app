import { createContext } from "react";

import { type IUser } from "../models/user";
import { type WithId } from "../types";

export interface CurrentUserContextValue {
  user?: WithId<IUser>;
  setUser: (newUser: WithId<IUser>) => void;
}

const CurrentUserContext = createContext<CurrentUserContextValue>({
  user: undefined,
  setUser: (_) => {},
});

export default CurrentUserContext;
