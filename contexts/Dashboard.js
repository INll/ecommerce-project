import { createContext, useContext, useReducer } from 'react';

// globally track states of Framer Motion animation events
const DashboardContext = createContext();
const DashboardDispatchContext = createContext();

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('Not used within an DashboardProvider');
  }
  return context;
}

export function useDashboardDispatch() {
  const context = useContext(DashboardDispatchContext);
  if (context === undefined) {
    throw new Error('Not used within an DashboardProvider');
  }
  return context;
}

export function DashboardProvider({ children }) {
  const [dashboardStates, dispatch] = useReducer(dashboardReducer, initialState);

  return (
    <DashboardContext.Provider value={dashboardStates}>
      <DashboardDispatchContext.Provider value={dispatch}>
        {children}  
      </DashboardDispatchContext.Provider>
    </DashboardContext.Provider>
  );
}

// animations are set to true once they have been played once
const initialState = {
  items: {},
  orders: {},
  users: {}
}

function dashboardReducer(dashboardStates, action) {
  switch (action.type) {
    case 'reset':
      return {
        ...dashboardStates,
        [action.animation]: false
      };
    case 'played':
      return {
        ...dashboardStates,
        [action.animation]: true
      };
    default:
      throw Error('Unknown action: ' + action.type);
  }
}