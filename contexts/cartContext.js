import { useReducer, useContext, createContext } from 'react';

const cartContext = createContext();
const cartDispatchContext = createContext();

export function useCartState() {
  const context = useContext(cartContext);
  if (context === undefined) throw new Error('useCartState: Not used within a Provider');
  return context;
}

export function useCartDispatch() {
  const context = useContext(cartDispatchContext);
  if (context === undefined) throw new Error('useCartDispatch: Not used within a Provider');
  return context;
}

const initialState = [];

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  return (
    <cartContext.Provider value={cart}>
      <cartDispatchContext.Provider value={dispatch}>
        {children}
      </cartDispatchContext.Provider>
    </cartContext.Provider>
  )
}

function cartReducer(cart, action) {
  switch (action.type) {
    case 'addedItem':
      if (cart.some((item) => item.id === action.payload.id)) {
        return cart.map((item) => {
          if (item.id === action.payload.id) {
            return { ...item, qty: item.qty++ };
          } else return item;
        })
      } else {
        return [ ...cart, action.payload ];
      };
    case 'increasedQty':
      return cart.map((item) => {
        if (item.id === action.payload.id) {
          return { ...item, qty: item.qty++ };
        } else return item;
      });
    case 'decreasedQty':
      return cart.map((item) => {
        if (item.id === action.payload.id && item.qty > 1) {
          return { ...item, qty: item.qty-- };
        } else return item;
      });
    case 'deletedItem':
      return cart.filter((item) => item.id !== action.payload.id);
    case 'clearedCart':  // on log out
      return [];
    case 'restoredItems':  // on refresh
      return JSON.parse(action.payload);
    case 'savedToLocalStorage':
      localStorage.setItem('cart', JSON.stringify(cart));
      return cart;
    default:
      throw Error('Unknown action type: ' + action.type);
  }
}