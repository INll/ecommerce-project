import { useContext, useReducer, createContext } from 'react';

const ViewContext = createContext(null);
const ViewDispatchContext = createContext(null);

export function useViewContext() {
  return useContext(ViewContext);
}

export function useViewDispatch() {
  return useContext(ViewDispatchContext);
}

export function ViewProvider({ children }) {
  const [ view, dispatch ] = useReducer(viewReducer, defaultView);

  return (
    <ViewContext.Provider value={view}>
      <ViewDispatchContext.Provider value={dispatch}>
        { children }
      </ViewDispatchContext.Provider>
    </ViewContext.Provider>
  );
}

function viewReducer(view, action) {
  switch (action.type) {
    case 'changeView':
      return { view: action.cat };
    default:
      throw Error('Unknown action: ' + action.sorting);
  }
}

const defaultView = {
  view: ''
};