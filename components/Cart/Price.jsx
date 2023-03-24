import React from 'react'
import { useCartState } from '../../contexts/cartContext';

export default function Price() {

  const cart = useCartState();
  const shipping = 50;
  const freeShippingThreshold = 400;

  let subTotal = cart.map((item) => item.details.price * item.qty).reduce((a, b) => a + b);

  return (
    <div className='relative pl-[20%] sm:pl-auto right-[10%] gap-5 w-full flex flex-col items-end'>
      <div className='w-full sm:w-[55%] flex flex-col text-lg'>
        <div className='flex justify-between items-center'>
          <span className=''>小計</span>
          <span>
            <span className='font-bold text-3xl mr-3'>{subTotal}</span>HKD
          </span>
        </div>
        <div className='flex justify-between items-center'>
          <span>
            運費{subTotal >= freeShippingThreshold 
            ? <span className='text-zinc-400 italic text-sm ml-3'>滿 {freeShippingThreshold}, 已減免運費</span> 
            : <span className='text-zinc-400 italic text-sm relative right-3 ml-5 w-auto'>還差 {freeShippingThreshold - subTotal}元 即可獲運費減免</span>}
          </span>
          <span>
            <span className='font-bold text-3xl mr-3'>{subTotal >= freeShippingThreshold ? 0 : shipping}</span>HKD
          </span>
        </div>
      </div>
      <div className='border-b-2 w-full sm:w-[60%]'></div>
      <div className='text-2xl'>
        總付<span className='font-bold text-4xl mx-3'>{subTotal >= freeShippingThreshold ? subTotal : subTotal + shipping }</span>HKD
      </div>
    </div>
  )
}
