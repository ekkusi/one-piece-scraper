import { Store } from "use-global-hook";
import { User } from "1337xto-subscriber-server/lib/prisma";
import { ActionTypes, GlobalState } from "./types";

const actions = {
  setUser: (store: Store<GlobalState, ActionTypes>, user: User) => {
    store.setState({ ...store.state, user });
  },
};

export default actions;
