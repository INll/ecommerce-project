import { useEffect, useRef } from 'react';
import { useCartDispatch } from '../../contexts/cartContext';
import { useAnimationDispatch, useAnimationState } from '../../contexts/AnimationContext';
import { motion, useAnimation } from 'framer-motion';
import Link from 'next/link';


export default function Cartdetails({ qty, details }) {

  const cartDispatch = useCartDispatch();
  const animationStates = useAnimationState();
  const animationDispatch = useAnimationDispatch();

  const prevAnimationState1 = useRef();
  const prevAnimationState2 = useRef();
  const prevAnimationState3 = useRef();

  function handleChangeQty(e) {
    if (e.target.name === `increaseQty_${details._id}`) {
      cartDispatch({ type: 'increasedQty', payload: { id: details._id } });
      animationDispatch({ type: 'toggledUnique', animationName: 'increasedCartItem', id: details._id });
    } else {
      cartDispatch({ type: 'decreasedQty', payload: { id: details._id } });
      animationDispatch({ type: 'toggledUnique', animationName: 'decreasedCartItem', id: details._id });
    }
    cartDispatch({ type: 'savedToLocalStorage', payload: null });
  };

  function handleDeleteItem(e) {
    if (e.target.name === `deleteItem_${details._id}`) {
      // animate exit first then dispatch deletedItem 100ms after
      animationDispatch({ type: 'toggledUnique', animationName: 'deletedCartItem', id: details._id });
      setTimeout(() => {
        cartDispatch({ type: 'deletedItem', payload: { id: details._id } });
        cartDispatch({ type: 'savedToLocalStorage', payload: null })  
      }, 150);
    }
  };

  const controlsCount = useAnimation();
  const controlsCard = useAnimation();

  // based on changed dependency, trigger animation
  useEffect(() => {
    if (prevAnimationState1.current !== animationStates.increasedCartItem) {
      if (animationStates.increasedCartItem.id === details._id) {
        controlsCount.set({ y: -2 });
        controlsCount.start({ y: 0 });
      };
    };
    if (prevAnimationState2.current !== animationStates.decreasedCartItem) {
      if (animationStates.decreasedCartItem.id === details._id) {
        controlsCount.set({ y: 2 });
        controlsCount.start({ y: 0 });
      };
    };
    if (prevAnimationState3.current !== animationStates.decreasedCartItem) {
      if (animationStates.deletedCartItem.id === details._id) {
        controlsCard.set({ scale: 1 });
        controlsCard.start({ scale: 0 });
      };
    };
    prevAnimationState1.current = animationStates.increasedCartItem;
    prevAnimationState2.current = animationStates.decreasedCartItem;
    prevAnimationState3.current = animationStates.deletedCartItem;
  }, [
    animationStates.increasedCartItem,
    animationStates.decreasedCartItem,
    animationStates.deletedCartItem
  ])

  return (
    <motion.li className='grid grid-cols-12 sm:pr-3 md:pr-4 sm:justify-center sm:detailss-center border-2 border-transparent bg-stone-700/80 rounded-[0.275rem] w-[100%] text-center'
      animate={controlsCard}
    >
      {/* onClick={() => router.push(`/details/${details._id}`)} */}
      {/* img tag determines height, negative margin compensates border-2 */}
      <div name='directToItem' className='col-span-3 w-full flex'>
        <img name='directToItem' className={`h-28 -my-[2px] object-contain rounded-t-[0.275rem] sm:rounded-tr-none sm:rounded-l-[0.275rem] sm:ml-[2px] sm:col-span-3`} id={details._id} src={details.images.url} alt={`Image of ${details.title}`}/>
      </div>
      <div name='directToItem' className='flex flex-col relative justify-center col-span-5'>
        <div name='directToItem' className='px-4'>{details.title}</div>
        <div name='directToItem' className='text-xl font-bold'><span className='text-sm text-zinc-400'>港幣</span>&nbsp;{(details.price * qty).toString()}</div>
      </div>
      <div className='col-span-2 flex flex-col justify-center'>
        <button className='hidden sm:flex sm:justify-center sm:items-center flex-1 active:translate-y-[0.15rem] active:bg-stone-800/40 transition-all duration-150' name={`increaseQty_${details._id}`} onClick={handleChangeQty}>
          <img className='w-6 h-6' src="/increase-arrow-white.png" alt="decrease arrow button" name={`increaseQty_${details._id}`}/>
        </button>
        <motion.div animate={controlsCount} className='h-full w-full sm:h-auto'>
          <div className='h-full w-full flex items-center justify-center font-bold text-xl'>{qty}</div>
        </motion.div>
        <button className='hidden sm:flex sm:justify-center sm:items-center flex-1 active:translate-y-[0.15rem] active:bg-stone-800/40 transition-all duration-150' name={`decreaseQty_${details._id}`} onClick={handleChangeQty}>
          <img className='w-6 h-6' src="/decrease-arrow-white.png" alt="decrease arrow button" name={`decreaseQty_${details._id}`}/>
        </button>
      </div>
      <button className='col-span-2' name={`deleteItem_${details._id}`} onClick={handleDeleteItem}>delete item</button>
    </motion.li>
  )
}
