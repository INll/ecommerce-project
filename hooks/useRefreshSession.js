import { useEffect } from "react";
import { useAuthState } from "@/contexts/AuthContext";

// set session dependent variables

export default function useRefreshSession({ setAnimated, loginTemp, setLoginTemp, setPrevForm }) {

  const session = useAuthState();

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

    if ((animationState === null || session.user === 'signed out') && animationState !== 'true' ) { 
      localStorage.setItem('animationState', false);  // should not play animation
      setAnimated(false);
      window.dispatchEvent(new Event('storage'));
     } else if (animationState === 'false' && session.user !== 'signed out') { // **stored as string**; also first login
      localStorage.setItem('animationState', true);
      setAnimated(true);
      window.dispatchEvent(new Event('storage'));
      console.log('=====');
     }
  }, [session]);
}