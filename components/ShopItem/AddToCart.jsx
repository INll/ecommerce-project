import { useAuthState } from '@/contexts/AuthContext';
import { useCartState, useCartDispatch } from '@/contexts/CartContext';
import { useAnimationDispatch } from '@/contexts/AnimationContext';

export default function AddToCart({ itemID, itemDetails }) {

  const session = useAuthState();
  const cart = useCartState();

  const dispatch = useCartDispatch();
  const animationDispatch = useAnimationDispatch();

  if (session.user !== 'signed out' && session.user !== false) {
    return (
      <>
        <button name='addToCart' id='addToCart' className={`mt-14 font-bold -right-0 sm:right-[0%] md:right-20 bottom-[2.2rem] border-[2px] rounded-[0.275rem] 
        border-green-500 bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-500 tracking-wide active:border-green-600 py-2 px-5 transition-all 
        active:from-emerald-600 active:via-emerald-600 active:to-emerald-600`}
          onClick={(e) => {
            dispatch({
              type: 'addedItem',
              payload: { id: itemID, qty: 1, details: itemDetails }
            });
            animationDispatch({
              type: 'toggled',
              animationName: 'addedToCart'
            });
            dispatch({
              type: 'savedToLocalStorage',
              payload: null
            })
        }}
        >新增一件至購物車</button>
      </>
    )} else {
      return <div></div>
  }
}