import { useEffect } from 'react';
import Cookies from 'universal-cookie';
import { useAuthDispatch } from "../contexts";

export default function useSession() {
  const dispatch = useAuthDispatch();
  const cookies = new Cookies();

  let validationStatus = '';
  let user = '';

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
          user: false,
          errMessage: 'invalid token'
        }
      })
      console.log('invalid token, logged out');
      localStorage.setItem('playedPromptAnimation', JSON.stringify(false));
    } else {
      if (user !== '') localStorage.setItem('currentUser', JSON.stringify(user));
      dispatch({
        type: 'loginSuccess',
        payload: {
          user: user,
          errMessage: null
        }
      })
      setLoginToggler(true);
      console.log('login status set');
    }
  }, []);
}