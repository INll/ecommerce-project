import React from 'react';
import * as Scroll from 'react-scroll'

export default function Hero() {

  let ScrollLink = Scroll.Link;
  
  return (
    <>
      <div id="homePage" className="bg-slate-800 sm:flex justify-center">
        <header className='px-20 py-20 sm:px-auto sm:py-auto sm:w-auto flex flex-col sm:flex-col justify-center items-center sm:items-start'>
          <h1 className='text-7xl font-semibold sm:py-[0.3rem] relative sm:left-[20%]'>男仕</h1>
          <h1 className='text-7xl font-semibold sm:py-[0.3rem] relative sm:left-[40%]'>精選</h1>
          <div className='text-3xl py-6 relative sm:left-[20%] md:w-auto'>襯衫，裇衫，西褲，應有盡有</div>
          <div className=''>
            <ScrollLink to='catelogue' smooth={true} duration={300} offset={-130}>
              <button className='bg-gradient-to-r from-amber-300 via-amber-100 to-amber-300
                w-fit relative sm:left-[35%] top-[25px] sm:top-[5%] text-zinc-900 px-6 py-3
                rounded-[0.2rem] font-extrabold text-[1.55rem] tracking-wider transition-ring
                ease[cubic-bezier(0.88, 1.09, 0.6, 0.98)] duration-150 ring-0 hover:ring-2 ring-amber-300'>立卽選購
              </button>
            </ScrollLink>
            <button className='hidden md:block bg-white relative left-[165%] bottom-[36%]
              bg-gradient-to-b from-white via-gray-300 to-gray-400  text-black font-extrabold
              hover:ring-2 ring-white px-3 py-[0.6rem] rounded-md text-lg'>
                <img src="/reload.png" alt="a dice" className='h-[25px]'/>
            </button>
          </div>
        </header>
        {/* TODO: Implement a random display of items based on click of refresh button*/}
        <div className='absolute hidden sm:block sm:relative w-max h-[550px] sm:w-[450px] flex justify-center'>
          <img src="/hero-man.png" alt="man in suit" className='h-[550px] w-auto object-cover sm:object-cover'/>
        </div>
      </div>
      <div className="h-[150px] sm:h-[100px] items-center grid grid-cols-3 divide-x bg-gradient-to-b from-slate-800 via-neutral-900 to-neutral-900">
        <div className='justify-self-center sm:flex gap-5 sm:items-center'>
          <img src="/delivery-truck-white.png" alt="free shipping on purchase above 700hkd" className='h-[70px]'/>
          <div className='flex flex-col items-center sd:block relative mb-2 sd:mb-0'>
            <div>滿 700</div>
            <div>免運費</div>
          </div>
        </div>
        <div>
          <div className='sm:justify-center sm:flex sm:gap-5'>
            <img src="/credit-card-white.png" alt="secure payment" className='h-[50px] mx-auto sm:mx-0' />
            <div className='flex flex-col pt-3 sm:pt-0 items-center sm:block'>
              <div>安全支付</div>
              <div>全程加密</div>
            </div>
          </div>
        </div>
        <div>
          <div className='sm:justify-center sm:flex sm:gap-5'>
          <img src="/7-days-white.png" alt="refund" className='h-[50px] mx-auto sm:mx-0'/>
            <div className='flex flex-col pt-3 sm:pt-0 items-center sm:block'>
              <div>七天</div>
              <div>退換貨政策</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}