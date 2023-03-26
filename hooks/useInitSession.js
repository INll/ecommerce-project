import { useRouter } from 'next/router';
import { useAuthDispatch } from '@/contexts/AuthContext';
import { useCartDispatch } from '@/contexts/CartContext';
import { useEffect } from 'react';

export default function useInitSession() {

  const router = useRouter();
  const dispatch = useAuthDispatch();
  const cartDispatch = useCartDispatch();

  let validationStatus = '';
  let user = '';

  // initialize an active session
  useEffect(() => {
    // store cookie returned by middleware.js that validates jwt
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
}