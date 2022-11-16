import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav>
      <div className='flex items-center gap-2 md:gap-4 justify-center w-100% md:pt-3'>
        <div className='text-center w-auto text-xl tracking-widest font-extralight'>MANSWHERE</div>
        <img src="/ms-logo-white.png" alt="logo" className='object-cover w-24'/>
      </div>
      <ul className='flex justify-evenly'>
        <li className='hidden sm:block px-4 pb-2 pt-4 transition-all duration-100 border-transparent border-b-[3px] hover:border-white'>主頁</li>
        <li className='hidden sm:block px-4 pb-2 pt-4 transition-all duration-100 border-transparent border-b-[3px] hover:border-white'>商品目錄</li>
        <li className='px-4 pb-2 pt-4 transition-all duration-100 border-transparent border-b-[3px] hover:border-white'>聯繫我們</li>
        <li className='px-4 pb-2 pt-4 transition-all duration-100 border-transparent border-b-[3px] hover:border-white'>用戶登入</li>
      </ul>
    </nav>
  )
}
