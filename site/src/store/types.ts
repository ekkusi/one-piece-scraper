import { User } from "1337xto-subscriber-server/lib/prisma";

export type ActionTypes = {
  setUser: (user: User | null) => void;
};

export type GlobalState = {
  user: User | null;
};
