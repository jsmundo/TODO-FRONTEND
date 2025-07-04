import React, { createContext, useRef, useState } from "react";
import getState from "../store/flux";

export const Context = createContext(null);

export const AppContext = ({ children }) => {
  const storeRef = useRef(null);

  const [state, setState] = useState(() => {
    const initialState = getState({
      getStore: () => storeRef.current.store,
      getActions: () => storeRef.current.actions,
      setStore: (updatedStore) => {
        setState((prevState) => {
          const newState = {
            store: {
              ...prevState.store,
              ...updatedStore,
            },
            actions: { ...prevState.actions },
          };
          storeRef.current = newState; // <- ¡clave! actualiza referencia interna
          return newState;
        });
      },
    });
    storeRef.current = initialState;
    return initialState;
  });

  return <Context.Provider value={state}>{children}</Context.Provider>;
};
