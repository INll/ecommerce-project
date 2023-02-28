import { useContext, createContext, useReducer } from "react";
import { authReducer, initialState } from "./reducer";

const authStateContext = createContext();  // save user details
const authDispatchContext = createContext();  // pass dispatch methods around

// hooks so useContext doesn't need to be called every time authorization
// is required
export function useAuthState() {
  const context = useContext(authStateContext);
  if (context === undefined) {
    throw new Error('Not used within a authProvider');
  }

  return context;
}

export function useAuthDispatch() {
  const context = useContext(authDispatchContext);
  if (context === undefined) {
    throw new Error('Not used within a authProvider');    
  }

  return context;
}

// global auth requires user state and dispatch() to work
export function AuthProvider({ children }) {
  const [session, dispatch] = useReducer(authReducer, initialState);

  return (
    <authStateContext.Provider value={session}>
      <authDispatchContext.Provider value={dispatch}>
        {children}
      </authDispatchContext.Provider>
    </authStateContext.Provider>
  );
};