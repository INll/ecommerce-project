import { useState, useEffect } from 'react';
import { useCartState } from '../../contexts/cartContext';

export default function Pay({ mutation }) {
  const [checked, setChecked] = useState(true);

  const cart = useCartState();

  function handleChange() {
    setChecked(!checked);
  }
  
  return (
    <div className='flex flex-col justify-center items-center px-[10%]'>
      <div className='flex items-center pt-12'>
        <input type="checkbox" id='confirmOrder' className='h-5 w-5' onChange={handleChange}/>
        <label htmlFor='confirmOrder' className='pl-4'>確認訂單</label>
      </div>
      <button name='addToCart' id='addToCart' disabled={checked} className={`w-full mt-8 font-bold -right-0 sm:right-[0%] md:right-20 bottom-[2.2rem] border-[2px] rounded-[0.275rem]
        border-green-500 bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-500 tracking-widest text-xl active:border-green-600 py-2 px-5 transition-all
        active:from-emerald-600 active:via-emerald-600 active:to-emerald-600 disabled:opacity-50 disabled:pointer-events-none`}
        onClick={(e) => {
          if (mutation.isLoading) return;
          mutation.mutate({ cart });
        }}
      >
        {mutation.isLoading
        ? <div className='flex justify-center py-1'>
            <svg className="animate-spin h-5 w-5 text-white z-20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        : '前住付款'}
      </button>
    </div>
  )
}
