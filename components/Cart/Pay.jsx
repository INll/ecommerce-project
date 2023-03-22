import { useState, useEffect } from 'react';

export default function Pay() {
  const [checked, setChecked] = useState(true);

  function handleChange() {
    setChecked(!checked);
  }

  useEffect(() => {
    console.log(checked);
  })
  
  return (
    <>
      <div className='flex items-center pt-5'>
        <input type="checkbox" id='confirmOrder' className='h-5 w-5 peer' onChange={handleChange}/>
        <label htmlFor='confirmOrder' className='pl-4'>確認訂單</label>
      </div>
      <button name='addToCart' id='addToCart' disabled={checked} className={`w-[80%] mt-8 font-bold -right-0 sm:right-[0%] md:right-20 bottom-[2.2rem] border-[2px] rounded-[0.275rem]
        border-green-500 bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-500 tracking-widest text-xl active:border-green-600 py-2 px-5 transition-all
        active:from-emerald-600 active:via-emerald-600 active:to-emerald-600 disabled:opacity-50 disabled:pointer-events-none`}>
        前住付款
      </button>
    </>
  )
}
