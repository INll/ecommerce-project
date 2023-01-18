import React from 'react';

export default function Catelogue() {
  return (
    <>
    <div className='bar w-full flex justify-between px-12 sm:px-14 md:px-[12%] py-7 bg-neutral-900'>
      <div className='title font-bold text-4xl'>熱賣商品</div>
      <div className='w-64'>
        <div className='font-bold w-fit text-4xl'>按</div>
        <div className='font-bold w-fit text-4xl'>排列</div>
      </div>
    </div>
    <hr className='h-px bg-slate-800 border-0' />
    <div className='broswer'>

    </div>
    </>
  )
}
