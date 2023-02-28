import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-scroll';
import LoginModal from './LoginModal/index';
import { useAuthState, useAuthDispatch } from "../contexts";
import Cookies from 'universal-cookie';
import * as NextLink from 'next/link';

export default function Navbar() {

  // prevent hydrdation error!! See: https://www.joshwcomeau.com/react/the-perils-of-rehydration/
  const [ hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // read context
  const dispatch = useAuthDispatch();
  const session = useAuthState();
  const cookies = new Cookies();

  let validationStatus = '';
  let user = '';

  // useEffect to attach eventListener to listen to mousedown events
  // if e.target.id of mousedown events is not backdrop
  // then there is no need to execute handleClose

  let mouseDownInsideModal;

  function logMouseDown(e) {
    if (e.target.id === 'backdrop') {
      mouseDownInsideModal = true;
    } else {
      mouseDownInsideModal = false;
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', logMouseDown, []);
    return () => {
      document.removeEventListener('mousedown', logMouseDown, []);
    }
  });

  // initialize an active session, if any
  useEffect(() => {
    // validationResults is passed by middleware.js that validates jwt
    const validationResults = cookies.get('validationResults');

    validationStatus = validationResults.result;
    user = validationResults.user;

    if (validationStatus === 'failed'){
      localStorage.removeItem('currentUser');
      dispatch({
        type: 'logout',
        payload: {
          user: null,
          errMessage: 'invalid token'
        }
      })
      console.log('invalid token, logged out');
    } else {
      if (user !== '') localStorage.setItem('currentUser', JSON.stringify(user));
      dispatch({
        type: 'loginSuccess',
        payload: {
          user: user,
          errMessage: null
        }
      })
      console.log('login status set');
    }
  }, []);

  // useEffect(() => {
  //   console.log(session.user);
  // })

  const [modalIsActive, setModalIsActive] = useState(false);
  const [loginTemp, setLoginTemp] = useState({
    userName: '',
    passWord: '',
    passWordConfirmation: '',
  });
  const [isRegistering, setIsRegistering] = useState(false);
  // save previous form data to curr vales
  const [prevForm, setPrevForm] = useState({
    formData: loginTemp,
    prevLoginResult: 0,   // if form hasn't changed, use previous response status code
    prevIsReg: false,  // changing isReg counts as different request
    hasChanged: false,
  });

  return (
    <div className="relative">
      <nav>
        <NextLink href="/" className="flex items-center justify-center gap-2 md:gap-4 w-100% md:pt-3">
          <div className='text-center w-auto text-xl tracking-widest font-extralight'>MANSWHERE</div>
          <img src="/ms-logo-white.png" alt="logo" className='object-cover w-24'/>
        </NextLink>
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
          <NextLink href="/profile">
            {hasMounted ? (session.user ? <li className='px-4 pb-2 pt-4 transition-all duration-200 border-transparent border-b-[3px] 
            hover:border-white'>
              個人主頁
            </li>
            : <li><button
              className='px-4 pb-2 pt-4 transition-all duration-200 border-transparent border-b-[3px]
            hover:border-white relative'
              onClick={() => {
                setModalIsActive(!modalIsActive);
              }}
            >用戶登入
            </button></li>) : null}
          </NextLink>
          <AnimatePresence initial={false}>
            {modalIsActive && <LoginModal 
              handleClose={() => {
                mouseDownInsideModal ? 
                (setModalIsActive(!modalIsActive)) : null 
              }}
              loginTemp={loginTemp}
              saveLoginInfo={setLoginTemp}
              isReg={isRegistering}
              setIsReg={setIsRegistering}
              prevForm={prevForm}
              setPrevForm={setPrevForm}
              modalIsActive={modalIsActive}
              setModalIsActive={setModalIsActive}
              />}
          </AnimatePresence>
        </ul>
      </nav>
      <img src="/shopping-cart-white.png" alt="shopping cart icon" className='absolute h-[50px] top-[5%] right-[0.4rem] transition-translate duration-100 hover:-translate-x-1 px-5 py-2'/>
    </div>
  )
}

