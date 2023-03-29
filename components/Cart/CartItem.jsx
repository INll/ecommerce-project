import { useEffect, useRef } from 'react';
import { useCartDispatch } from '@/contexts/CartContext';
import { useAnimationDispatch, useAnimationState } from '@/contexts/AnimationContext';
import { motion, useAnimation } from 'framer-motion';
import { useRouter } from 'next/router';
import useResetAnimation from 'hooks/useResetAnimation';

export default function Cartdetails({ qty, details }) {

  const router = useRouter();

  const cartDispatch = useCartDispatch();
  const animationStates = useAnimationState();
  const animationDispatch = useAnimationDispatch();

  const prevAnimationState1 = useRef();
  const prevAnimationState2 = useRef();
  const prevAnimationState3 = useRef();
  
  function clearAnimationStates() {
    setTimeout(() => {
      animationDispatch({ type: 'reset', animationName: ['increasedCartItem', 'decreasedCartItem', 'deletedCartItem']});
    }, 150);
  }

  function handleChangeQty(e) {
    if (e.target.name === `increaseQty_${details._id}`) {  // add one
      cartDispatch({ type: 'increasedQty', payload: { id: details._id } });
      animationDispatch({ type: 'toggledUnique', animationName: 'increasedCartItem', id: details._id });
    } else if (e.target.name === `decreaseQty_${details._id}`) {  // deduct one
      cartDispatch({ type: 'decreasedQty', payload: { id: details._id } });
      animationDispatch({ type: 'toggledUnique', animationName: 'decreasedCartItem', id: details._id });
    } else {  // changed qty directly
      cartDispatch({ type: 'changedToQty', payload: { id: details._id, newQty: Number(e.target.value) } });
    }
    cartDispatch({ type: 'savedToLocalStorage', payload: null });
    clearAnimationStates();
  };

  function handleDeleteItem(e) {
    if (e.target.name === `deleteItem_${details._id}` || e.target.className.includes(`deleteItem_${details._id}`)) {
      // animate exit first then dispatch deletedItem 100ms after
      animationDispatch({ type: 'toggledUnique', animationName: 'deletedCartItem', id: details._id });
      setTimeout(() => {
        cartDispatch({ type: 'deletedItem', payload: { id: details._id } });
        cartDispatch({ type: 'savedToLocalStorage', payload: null })
      }, 150);
      clearAnimationStates();
    }
  };

  function handleDirectToItem(e) {
    if (e.target.className.includes('directToItem')) {
      router.push(`/item/${details._id}`);
    };
  };

  // useResetAnimation(['increasedCartItem', 'decreasedCartItem', 'deletedCartItem']);

  function selectOptions(max) {
    const option = [];
    for (let i = 1; i <= max; i++) {
      option.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    };
    return option;
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
    if (prevAnimationState3.current !== animationStates.deletedCartItem) {
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
    <motion.li className='grid grid-cols-12 sm:pr-3 md:pr-4 sm:justify-center border-2 border-transparent bg-stone-700/80 rounded-[0.275rem] w-[100%] text-center'
      animate={controlsCard}
    >
      {/* img tag determines height, negative margin compensates border-2 */}
      <div name='directToItem' className='col-span-3 w-full flex sm:justify-center cursor-pointer'
        onClick={handleDirectToItem}
      >
        <img name='directToItem' className={`h-28 -my-[2px] object-contain rounded-t-[0.275rem] sm:rounded-tr-none sm:rounded-l-[0.275rem] sm:ml-[2px] sm:col-span-3 cursor-pointer`} id={details._id} src={details.images.url} alt={`Image of ${details.title}`}/>
      </div>
      <div className='flex flex-col relative justify-center col-span-5 cursor-pointer'>
        <div className='directToItem px-4 hover:font-bold hover:underline' onClick={handleDirectToItem} >{details.title}</div>
        <div className='text-xl font-bold'><span className='text-sm text-zinc-400'>港幣</span>&nbsp;{(details.price * qty).toString()}</div>
      </div>
      <div className='col-span-2 flex flex-col justify-center'>
        <button className='hidden sm:flex sm:justify-center sm:items-center flex-1 active:translate-y-[0.15rem] active:bg-stone-800/40 transition-all duration-150' name={`increaseQty_${details._id}`} onClick={handleChangeQty}>
          <img className='w-6 h-6' src="/increase-arrow-white.png" alt="decrease arrow button" name={`increaseQty_${details._id}`}/>
        </button>
        <motion.div animate={controlsCount} className='h-fit w-full flex flex-col items-center justify-center sm:h-auto'>
          <div className='hidden h-full w-full sm:flex sm:items-center sm:justify-center font-bold text-xl'>{qty}</div>
          <select name="changeQty" value={qty} className={`sm:hidden h-fit w-14 changedQty_${details._id}`} onChange={handleChangeQty}>
            {selectOptions(99)}
          </select>
        </motion.div>
        <button className='hidden sm:flex sm:justify-center sm:items-center flex-1 active:translate-y-[0.15rem] active:bg-stone-800/40 transition-all duration-150' name={`decreaseQty_${details._id}`} onClick={handleChangeQty}>
          <img className='w-6 h-6' src="/decrease-arrow-white.png" alt="decrease arrow button" name={`decreaseQty_${details._id}`}/>
        </button>
      </div>
      <button className='col-span-2 active:bg-stone-800/40 transition-all duration-150' name={`deleteItem_${details._id}`} onClick={handleDeleteItem}>
        <span className={`tracking-wider deleteItem_${details._id}`}>刪除<span className={`tracking-wider hidden sm:inline deleteItem_${details._id}`}>物品</span></span>
      </button>
    </motion.li>
  )
}
