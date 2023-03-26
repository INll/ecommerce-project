import { useEffect, useState } from "react";
import { useCartState } from "@/contexts/CartContext";
import { useAnimationState } from "@/contexts/AnimationContext";
import { motion, useAnimation } from 'framer-motion';
import Link from 'next/link';

export default function CartIcon() {
  const [itemCount, setItemCount] = useState(0)
  
  const cart = useCartState();
  const animationStates = useAnimationState();

  useEffect(() => {
    let itemCount = cart.map((item) => item.qty).reduce((a, b) => a + b, 0);
    setItemCount(itemCount);
  }, [cart])

  const controls = useAnimation();
  // subscribe to change to render animation
  useEffect(() => {
    controls.set({
      y: -3,
      x: -4,
      scale: 0.51,
    });
    controls.start({
      y: 0,
      x: 0,
      scale: 1
    })
  }, [animationStates.addedToCart])

  return (
    <>
      <Link href="/cart">
        <img src="/shopping-cart-white.png" alt="shopping cart icon" className='absolute h-[50px] top-[5%] right-[0.4rem] transition-translate duration-100 px-5 py-2 cursor-pointer'/>
        <motion.div className="absolute top-2 right-0 w-10 h-10" animate={controls}>
          <div className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 top-[5%] right-[0.4rem] rounded-full cursor-pointer">{itemCount}</div>
        </motion.div>
      </Link>
    </>
  )
}
