import React, { useReducer, createContext } from "react";
import { userReducer } from "./Reducers/userReducer";

export const UserContext = createContext();

const initialState = {
  userName: undefined,
  userEmail: undefined,
  userPhone: undefined,
  honey: 'clean'
};

export const Store = props => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={[state, dispatch]}>
      {props.children}
    </UserContext.Provider>
  );
};
