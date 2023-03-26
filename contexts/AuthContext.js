import { useContext, createContext, useReducer } from "react";

const authStateContext = createContext();
const authDispatchContext = createContext();

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

// user is the same object used to sign jwts
const initialState = {
  user: 'signed out',
  err: null
}

export function authReducer(initialState, action) {
  switch (action.type) {
    case 'loginSuccess':
      return {
        user: action.payload.user,
        err: action.payload.errMessage
      };
    case 'logout':
      return {
        ...initialState,
        user: 'signed out'
      };
    case 'loginFailure':
      return {
        user: false,
        err: action.payload.errMessage
      };
    case 'updateFav':
      return {
        ...initialState,
        user: action.payload.user
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

