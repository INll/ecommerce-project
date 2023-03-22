import { useReducer, createContext, useContext } from 'react';

const animationContext = createContext();
const animationDispatchContext = createContext();

export function useAnimationState() {
  const context = useContext(animationContext);
  if (context === undefined) throw new Error('useAnimationState: Not used within a Provider');
  return context;
}

export function useAnimationDispatch() {
  const context = useContext(animationDispatchContext);
  if (context === undefined ) throw new Error('useAnimationDispatch: Not used within a Provider');
  return context;
}

// depended by useEffect() to trigger animation
const initialState = {
  addedToCart: false,
  increasedCartItem: { state: false, id: ''},
  decreasedCartItem: { state: false, id: ''},
  deletedCartItem: { state: false, id: ''},
};

export function AnimationProvider({ children }) {
  const [animationStates, dispatch] = useReducer(animationReducer, initialState);

  return (
    <animationContext.Provider value={animationStates}>
      <animationDispatchContext.Provider value={dispatch}>
        {children}
      </animationDispatchContext.Provider>
    </animationContext.Provider>
  )
}

// dispatch an update, used by element that triggers animation
function animationReducer(animationStates, action) {
  switch (action.type) {
    case 'toggled':
      return {
        ...animationStates,
        [action.animationName]: !animationStates[action.animationName]
      }
    case 'toggledUnique':
      return {
        ...animationStates,
        [action.animationName]: { 
          state: !animationStates[action.animationName.state],
          id: action.id
        }
      }
    default:
      throw new Error('animationContext: unknown action type: ' + action.type);
  }
}