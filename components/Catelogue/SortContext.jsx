import { useContext, useReducer, createContext } from 'react';

const SortContext = createContext(null);
const SortDispatchContext = createContext(null);

export function useSortContext() {
  return useContext(SortContext);
}

export function useSortDispatch() {
  return useContext(SortDispatchContext);
}

export function SortProvider({ children }) {
  const [ sort, dispatch ] = useReducer(sortReducer, defaultSort);

  return (
    <SortContext.Provider value={sort}>
      <SortDispatchContext.Provider value={dispatch}>
        { children }
      </SortDispatchContext.Provider>
    </SortContext.Provider>
  );
}

function sortReducer(sort, action) {
  switch (action.type) {
    case 'changeSort':
      return { 
        ...sort, 
        sort: action.sorting };
    default:
      throw Error('Unknown action: ' + action.sorting);
  }
}

const defaultSort = {
  sort: '默認'
};