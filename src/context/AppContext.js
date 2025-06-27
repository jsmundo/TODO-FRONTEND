import React, { createContext, useState } from "react";
import getState from "../store/flux";

// create a context

export const Context = createContext(null);

export const AppContext = ({ children }) => {
  const [state, setState] = useState(
    getState({
      getStore: () => state.store,
      getActions: () => state.actions,
      setStore: (updatedStore) =>
        setState({
          store: {
            ...state.store,
            ...updatedStore,
          },
          actions: { ...state.actions },
        }),
    })
  );
  return <Context.Provider value={state}>{children}</Context.Provider>;
};
