import { createContext } from 'react';

// Store form info temporarily before submission
export const LoginFormContext = createContext({
  userName: '',
  passWord: '',
});