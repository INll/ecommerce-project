import { React, useContext, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import NextAuth, {NextAuthOptions} from "next-auth";
// import { CredentialsProvider } from "next-auth/providers";
import * as Yup from 'yup';
import axios from "axios";

// Validation protocol for login items
const loginReqs = {
  username: {
    min: 3,
    max: 15,
  },
  password: {
    min: 8,
    max: 20,
  },
}

const loginSchema = Yup.object().shape({
  userName: Yup.string()
  .min(loginReqs.username.min, `必須多於 ${loginReqs.username.min} 個字符`)
  .max(loginReqs.username.max, `必須少於 ${loginReqs.username.max} 個字符`)
  .required('此項不能爲空'),
  passWord: Yup.string()
  .min(loginReqs.password.min, `必須多於 ${loginReqs.password.min} 個字符`)
  .max(loginReqs.password.max, `必須少於 ${loginReqs.password.max} 個字符`)
  .required('此項不能爲空'),
})

const registrationSchema = Yup.object().shape({
  userName: Yup.string()
  .min(loginReqs.username.min, `必須多於 ${loginReqs.username.min} 個字符`)
  .max(loginReqs.username.max, `必須少於 ${loginReqs.username.max} 個字符`)
  .required('此項不能爲空'),
  passWord: Yup.string()
  .min(loginReqs.password.min, `必須多於 ${loginReqs.password.min} 個字符`)
  .max(loginReqs.password.max, `必須少於 ${loginReqs.password.max} 個字符`)
  .matches(/[0-9]/, '密碼必須包含至少一個數字')
  .matches(/[a-z]/, '密碼必須包含至少一個細楷英文字母')
  .matches(/[A-Z]/, '密碼必須包含至少一個大楷英文字母')
  .required('此項不能爲空'),
  passWordConfirmation: Yup.string()
  .min(loginReqs.password.min, `必須多於 ${loginReqs.password.min} 個字符`)
  .max(loginReqs.password.max, `必須少於 ${loginReqs.password.max} 個字符`)
  .matches(/[0-9]/, '密碼必須包含至少一個數字')
  .matches(/[a-z]/, '密碼必須包含至少一個細楷英文字母')
  .matches(/[A-Z]/, '密碼必須包含至少一個大楷英文字母')
  .required('此項不能爲空')
  .oneOf([Yup.ref('passWord'), null], '密碼不一致, 請再試一次'),
})

function handleError (err, res) {
  console.log(`Error: ${err}`);
  res.json(err);
  res.status(405).end();
}

export default function index({ onClick, loginTemp, saveLoginInfo, isReg, setIsReg }) {
  // track states of hidden elements
  const [elementStates, setElementStates] = useState({
    loginUsernameFailure: false,
  });
  const [buttonStates, setButtonStates] = useState({
    loginSignupButton: false,
  });
  const [passwordShown, setPasswordShown] = useState(false);
  // signin:
  // {userName: 'asdf', passWord: 'asdfasdfasdf', passWordConfirmation: ''}

  function showPassword() {
    setPasswordShown(!passwordShown);
  }

  return (
    <div>
      {/* css disables edge reveal password icon. its annoying */}
      <link rel="stylesheet" href="style.css" />  
      {/* Go Backdrop to set Modal horizontal position */}
      <div className='w-[21rem] pt-12 pb-4 min-h-fit rounded-md border-0'>
      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={loginTemp}
        validationSchema={isReg ? registrationSchema : loginSchema}
        onSubmit={async (value) => {
          console.log('clicked');
          setButtonStates({
            ...buttonStates,
            loginSignupButton: true
          });
          if (!isReg) {
            try {
              const response = await axios.post('/api/login', value);
              switch (response.data.loginResult){
                case 0: // username not found, let user signup instead
                  setIsReg(!isReg);
                  setElementStates({ 
                    ...elementStates, 
                    loginUsernameFailure: true
                  });
                  setTimeout(() => {
                    setElementStates({
                      ...elementStates,
                      loginUsernameFailure: false
                    })
                  }, 8500);
                  break;
                case 1:
                  
              }
            } catch (err) {
              handleError(err);
            }
          } else {
            try {
              const response = await axios.post('api/signup.js', value);
              // THIS IS FOR SIGNUP LOGICS
            } catch (err) {
              handleError(err);
            }
          }
          setButtonStates({
            ...buttonStates,
            loginSignupButton: false
          });
        }}
      >
      {({ errors, touched, values }) => (
        <Form 
          className="flex flex-col w-auto gap-6"
          onKeyUp={() => {
            saveLoginInfo({
            userName: values.userName,
            passWord: values.passWord,
            passWordConfirmation: values.passWordConfirmation,
          });    
        }}
        >
          <button className="absolute text-white-500 font-bold text-2xl top-[-0.1rem] 
            right-3 px-1 pt-1 pb-1"
            onClick={() => {
              onClick();
            }}
          >x</button>
          {elementStates.loginUsernameFailure ? (
            <div className="font-bold text-red-600 text-[0.8rem] left-[7.5rem] top-7 absolute"
            >用戶不存在，請確認密碼以完成注冊
            </div>
          ) : null
          }
          <div className="flex items-center justify-center gap-4">
            <label htmlFor="username" className="basis-1/5">用戶名稱</label>
            <Field
              className="h-8 rounded pl-2 relative"
              id="username"
              name="userName"
            />
            {errors.userName ? (
              <div
                className="font-bold text-red-600 text-[0.8rem] absolute left-[7.5rem] top-[1.75rem]"
              >{errors.userName}</div>
             ) : null
            }
          </div>
          <div className="flex items-center justify-center gap-4">
          <label htmlFor="password"  className="basis-1/5">密碼</label>
          <button 
            className="absolute h-5 w-5 right-[2.6rem]"
            onClick={showPassword}
            type='button'
          >
            {passwordShown ? <img src='/hide_pd_white.png'/>
            : <img src='/view_pd_white.png'/>}
          </button>
            <Field
              className="h-8 rounded pl-2 passwordField"
              type={passwordShown ? 'text' : 'password'}
              id="password"
              name="passWord"
            />
            {errors.passWord ? (
              <div
                className="font-bold text-red-600 text-[0.8rem] absolute left-[7.5rem] top-[5.3rem]"
              >{errors.passWord}</div>
             ) : null
            }
          </div>
          {isReg ? 
            <div className="flex items-center justify-center gap-4">
            <label htmlFor="passwordConfirmation"  className="basis-1/5">確認密碼</label>
            <button 
              className="absolute h-5 w-5 right-[2.6rem]"
              onClick={showPassword}
              type='button'
            >
              {passwordShown ? <img src='/hide_pd_white.png'/>
              : <img src='/view_pd_white.png'/>}
            </button>
              <Field
                className="h-8 rounded pl-2 passwordField"
                type={passwordShown ? 'text' : 'password'}
                id="passwordConfirmation"
                name="passWordConfirmation"
              />
              {errors.passWordConfirmation ? (
                <div
                  className="font-bold text-red-600 text-[0.8rem] absolute left-[7.5rem] top-[8.8rem]"
                >{errors.passWordConfirmation}</div>
                ) : null
              }
            </div>
          : null }
          <div className="flex justify-center relative">
            {isReg ? <button
                className="mt-4 mb-3 w-1/4 bg-blue-500 hover:bg-blue-700 text-white 
                font-bold py-2 px-3 rounded"
                type="submit"
              >注 冊</button> : <button
                className="mt-4 mb-3 w-1/4 bg-blue-500 hover:bg-blue-700 text-white 
                font-bold py-2 px-3 rounded disabled:bg-blue-900
                disabled:text-slate-400"
                type="submit"
                disabled={buttonStates.loginSignupButton}
              >登 入</button>}
            <button 
              className="absolute top-8 right-[4.5rem] underline"
              onClick={() => {
                setIsReg(!isReg);
              }}
              type='button'
            >
              {isReg ? '登入' : '注冊'}
            </button>
          </div>
        </Form>
      )}
      </Formik>
      </div>
    </div>
  )
}