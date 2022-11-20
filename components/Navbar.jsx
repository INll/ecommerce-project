import React from 'react';
import { Link } from 'react-scroll';

export default function Navbar() {  
  return (
    <div className="relative">
      <nav>
        <div className='flex items-center gap-2 md:gap-4 justify-center w-100% md:pt-3'>
          <div className='text-center w-auto text-xl tracking-widest font-extralight'>MANSWHERE</div>
          <img src="/ms-logo-white.png" alt="logo" className='object-cover w-24'/>
        </div>
        <ul className='flex justify-evenly'>
          <Link
            activeClass='active'
            to='homePage'
            spy={true}
            smooth={true}
            duration={500}>
            <li className='hidden sm:block px-4 pb-2 pt-4 transition-all duration-200 border-transparent
              border-b-[3px] hover:border-white cursor-pointer'>
              主頁
            </li>
          </Link>
          <Link
            activeClass='active'
            to='/cart'
            spy={true}
            smooth={true}
            duration={500}>
            <li className='hidden sm:block px-4 pb-2 pt-4 transition-all duration-200 border-transparent
              border-b-[3px] hover:border-white'>
              商品目錄
            </li>
          </Link>
          <li className='px-4 pb-2 pt-4 transition-all duration-200 border-transparent border-b-[3px] 
          hover:border-white'>
            聯繫我們
          </li>
          <li className='px-4 pb-2 pt-4 transition-all duration-200 border-transparent border-b-[3px]
           hover:border-white'>
            用戶登入
          </li>
        </ul>
      </nav>
      <img src="/shopping-cart-white.png" alt="shopping cart icon" className='absolute h-[50px] top-[5%] right-[0.4rem] transition-translate duration-100 hover:-translate-x-1 px-5 py-2'/>
    </div>
  )
}
