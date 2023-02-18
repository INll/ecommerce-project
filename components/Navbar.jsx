import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-scroll';
import LoginModal from './LoginModal/index';

export default function Navbar() {
  const [modalIsActive, setModalIsActive] = useState(false);
  const [loginTemp, setLoginTemp] = useState({
    userName: '',
    passWord: '',
    passWordConfirmation: '',
  });
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="relative">
      <nav>
        <div className="flex items-center justify-center gap-2 md:gap-4 w-100% md:pt-3">
          <div className='text-center w-auto text-xl tracking-widest font-extralight'>MANSWHERE</div>
          <img src="/ms-logo-white.png" alt="logo" className='object-cover w-24'/>
        </div>
        <ul className='flex justify-evenly'>
          <Link
            className='hidden sm:block'
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
            className='hidden sm:block'
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
          <button
            className='px-4 pb-2 pt-4 transition-all duration-200 border-transparent border-b-[3px]
           hover:border-white relative'
            onClick={() => {
              setModalIsActive(!modalIsActive);
              // if(modalIsActive) {
              //   setLoginTemp({
              //     userName: 
              //   })
              // }
            }}
          >用戶登入
          </button>
          <AnimatePresence initial={false}>
            {modalIsActive && <LoginModal 
              handleClose={() => {
                return (setModalIsActive(!modalIsActive))
              }}
              loginTemp={loginTemp}
              saveLoginInfo={setLoginTemp}
              isReg={isRegistering}
              setIsReg={setIsRegistering}
              />}
          </AnimatePresence>
        </ul>
      </nav>
      <img src="/shopping-cart-white.png" alt="shopping cart icon" className='absolute h-[50px] top-[5%] right-[0.4rem] transition-translate duration-100 hover:-translate-x-1 px-5 py-2'/>
    </div>
  )
}

