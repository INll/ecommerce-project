import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { scroller } from 'react-scroll';
import LoginModal from '../LoginModal/index';
import { useAuthState, useAuthDispatch } from "../../contexts";
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import * as NextLink from 'next/link';
import CartIcon from './CartIcon';
import { useCartDispatch } from '../../contexts/cartContext';

export default function Navbar() {

  // prevent hydrdation error!! See: https://www.joshwcomeau.com/react/the-perils-of-rehydration/
  // but basically, I originally tried to conditionally render components **during** hydration,
  // which caused hydration result to be different than that of the initial HTML by using useEffect, setHasMountd is called after hydration.
  const [ hasMounted, setHasMounted ] = useState(false);
  const [ animated, setAnimated ] = useState(false);
  const router = useRouter();

  // console.log('animated outside of useEffect ' + animated);
  
  function removeThis(e) {
    document.getElementById(e.target.id).remove();
  }

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // read context
  const dispatch = useAuthDispatch();
  const session = useAuthState(); 

  const cartDispatch = useCartDispatch();


  let validationStatus = '';
  let user = '';

  // useEffect to attach eventListener to listen to mousedown events if e.target.id
  // of mousedown events is not backdrop then there is no need to execute handleClose
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
    const validationResults = JSON.parse(getCookie('validationResults'));

    validationStatus = validationResults.result;
    user = validationResults.user;
    console.log(validationResults);

    if (validationStatus === 'failed'){
      dispatch({
        type: 'logout',
        payload: {
          user: false,
          errMessage: 'invalid token'
        }
      })
      console.log('invalid token, logged out; redirecting...');
      localStorage.removeItem('currentUser');
      window.dispatchEvent(new Event('storage'));
      router.push('/');
    } else if (validationStatus === 'signedOut') {
      console.log('validation status signed out!');
      dispatch({
        type: 'logout',
        payload: {
          user: false,
          errMessage: 'successful sign out'
        }
      })
      console.log('signing out');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('animationState');
      window.dispatchEvent(new Event('storage'));
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
      let localStorageCart = localStorage.getItem('cart');
      if (localStorageCart !== null) {
        cartDispatch({
          type: 'restoredItems',
          payload: localStorageCart
        })
      }
    }
  }, []);

  // set session dependent variables
  useEffect(() => {
    if (JSON.stringify(session.user)) {
      setLoginTemp({
        userName: '',
        passWord: '',
        passWordConfirmation: '',
      });
      setPrevForm({
        formData: loginTemp,
        prevLoginResult: 0,
        prevIsReg: false,
        hasChanged: false,
      })
    }
    // 'animationState' remembers if session has ever played animation
    // It will be set to true after user has signed in, and stays true only until it gets delete when user signs out then it will be set to false again
    let animationState = localStorage.getItem('animationState');
    console.log()
    if ((animationState === null || session.user === 'signed out') && animationState !== 'true' ) { 
      // should not play animation
      localStorage.setItem('animationState', false);
      console.log('animated set to false');
      setAnimated(false);
      window.dispatchEvent(new Event('storage'));
     } else if (animationState === 'false' && session.user !== 'signed out') { // **stored as string**; also first login
      console.log(`Eval: ${animationState}`);
      localStorage.setItem('animationState', true);
      setAnimated(true);
      window.dispatchEvent(new Event('storage'));
      console.log('=====');
     }
  }, [session]);

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
      <nav className="bg-black w-[100%] fixed z-[100]">
        <NextLink href="/" className="relative flex items-center justify-center gap-2 md:gap-4 w-100% md:pt-3">
          <div className='text-center w-auto text-xl tracking-widest font-extralight'>MANSWHERE</div>
          <img src="/ms-logo-white.png" alt="logo" className='object-cover w-24'/>
          <div className='hidden sm:block sm:relative'><span className='absolute tracking-wider font-thin text-sm -left-3 w-56 -rotate-3'>Discover your Strong Suit.</span></div>
        </NextLink>
        <div className='text-[0.76rem] text-center font-thin sm:hidden tracking-widest -mb-1'>Discover your strong suit.</div>
        <ul className='flex justify-evenly'>
          <NextLink href="/">
            <li className='block px-4 pb-2 pt-4 transition-all duration-200 border-transparent border-b-[3px] hover:border-white cursor-pointer'>
              主頁
            </li>
          </NextLink>
          <NextLink className='hidden sm:block' href='/' onClick={() => {
            setTimeout(() => {scroller.scrollTo('catelogue', { smooth: true, duration: 300, offset: -130 })}, 500)
          }}>
            <li className='hidden sm:block px-4 pb-2 pt-4 transition-all duration-200 border-transparent
              border-b-[3px] hover:border-white cursor-pointer'>商品目錄
            </li>
          </NextLink>
          <li className='hidden sm:block px-4 pb-2 pt-4 transition-all duration-200 border-transparent border-b-[3px] 
          hover:border-white'>聯繫我們
          </li>
          {hasMounted
            ? (session.user !== 'signed out' && session.user !== false
                ? (session.user.clearance === 2
                    ? <NextLink href="/profile/admin"><li className='px-4 pb-2 pt-4 transition-all duration-200 border-transparent border-b-[3px] 
                    hover:border-white'>管理面板</li></NextLink>
                    : <NextLink href={`/profile/${session.user.userName}`}><li className='px-4 pb-2 pt-4 transition-all duration-200 border-transparent border-b-[3px] 
                    hover:border-white'>個人主頁</li></NextLink>
                  )
                : <li><button className='px-4 pb-2 pt-4 transition-all duration-200 border-transparent border-b-[3px]
                hover:border-white relative'onClick={() => {setModalIsActive(!modalIsActive);}}>用戶登入</button></li>
              )
            : null
          }
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
        {hasMounted  // playedPromptAnimation === false so this plays only once after last log out
          ? (session.user
              ? (session.user.clearance === 2  // 2
                  ? (
                    <div className='fixed min-w-[10rem] h-14 rounded-[0.26rem] bg-red-100
                      px-8 py flex items-center pb-[0.14rem] justify-center top-3 right-3 z-50'>
                      <div className='text-red-500 tracking-tight text-xl font-bold'>正在以管理員身份瀏覽</div>
                    </div>
                    )
                    // Good hack!!!! Can't seem to overflow-hide an absolutely positioned element, so
                    // I removed the absolute positioning to a parent div, and do overflow-hidden here
                  : (animated === true && session.user.clearance === 0) // 0
                    ? (
                        <div className='absolute overflow-hidden border-red-500 top-3 right-3 w-fit pr-20 h-20 border-0 z-10 pointer-events-none'>
                          {/* poniter events auto so child still receive mouse event */}
                          <motion.div className='min-w-[10rem] h-14 rounded-[0.26rem] bg-green-100 max-w-fit
                          flex items-center pb-[0.14rem] justify-center top-3 right-3 pointer-events-auto'
                          initial={{ opacity: 0, x: 300 }}
                          animate={{ opacity: 1, x: 80 }}
                          onTap={(e) => {
                            removeThis(e);
                          }}
                          transition={{ type: "spring", duration: 0.5, bounce: 0.3, repeat: 1, repeatType: 'reverse', repeatDelay: 2 }}
                          id='loginSuccessPrompt'
                          >
                            <div className='text-emerald-600 w-fit mx-8 text-xl font-semibold pointer-events-none'>{(session.err === 'signup success') ? '歡迎來到MANSWHERE' : '歡迎回來'}, {session.user.userName}!</div>
                          </motion.div>
                        </div>
                      ) 
                    : null
                ) 
              : null
            )
          : null
        }
      <CartIcon />
      </nav>
      <div className='h-[6.7rem]'></div>
    </div>
  )
}