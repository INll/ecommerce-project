import { React, useContext, useEffect, useState } from "react";
import { useAuthState, useAuthDispatch } from "../../contexts";
import { Formik, Form, Field, ErrorMessage } from 'formik';
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
  .oneOf([Yup.ref('passWordConfirmation'), null], '密碼不一致, 請再試一次')
  .min(loginReqs.password.min, `必須多於 ${loginReqs.password.min} 個字符`)
  .max(loginReqs.password.max, `必須少於 ${loginReqs.password.max} 個字符`)
  .matches(/[0-9]/, '密碼必須包含至少一個數字')
  .matches(/[a-z]/, '密碼必須包含至少一個細楷英文字母')
  .matches(/[A-Z]/, '密碼必須包含至少一個大楷英文字母')
  .required('此項不能爲空'),
  passWordConfirmation: Yup.string()
  .oneOf([Yup.ref('passWord'), null], '密碼不一致, 請再試一次')
  .min(loginReqs.password.min, `必須多於 ${loginReqs.password.min} 個字符`)
  .max(loginReqs.password.max, `必須少於 ${loginReqs.password.max} 個字符`)
  .matches(/[0-9]/, '密碼必須包含至少一個數字')
  .matches(/[a-z]/, '密碼必須包含至少一個細楷英文字母')
  .matches(/[A-Z]/, '密碼必須包含至少一個大楷英文字母')
  .required('此項不能爲空'),
})

function handleError (err, res) {
  console.log(`Error: ${err}`);
  console.log(err.stack);
  res.json(err);
  res.status(405).end();
}

export default function index({ onClick, loginTemp, saveLoginInfo, isReg, setIsReg,
  prevForm, setPrevForm, modalIsActive, setModalIsActive
 }) {

  // read contexts
  const dispatch = useAuthDispatch();
  const session = useAuthState();
  
  // track states of hidden warning message elements
  const [elementStates, setElementStates] = useState({
    loginUsernameFailure: false,
    loginPasswordFailure: false,
    signUpUsernameFailure: false,
  });

  const [buttonDisabled, setButtonDisabled] = useState({
    loginSignupButton: false,
  });

  const [passwordShown, setPasswordShown] = useState(false);

  // state event handlers
  function handleShowPassword() {
    setPasswordShown(!passwordShown);
  }

  function handleButtonStates(button, action) {
    if (action === 'enable') {
      action = false;
    } else if (action === 'disable') {
      action = true;
    } else {
      throw new SyntaxError('invalid event handler action param');
    }
    setButtonDisabled({
      ...buttonDisabled,
      [button]: action
    });
  }

  function handleWarningMsg(warning, timeout) {
    if (warning === 'reset') {
      setElementStates({
        loginUsernameFailure: false,
        loginPasswordFailure: false,
        signUpUsernameFailure: false,
      });
      return;
    }
    setElementStates({ 
      ...elementStates, 
      [warning]: true
    });
    setTimeout(() => {
      setElementStates({
        ...elementStates,
        [warning]: false
      })
    }, timeout);
  }

  let loginResult;
  let token;
  let user;

  return (
    <div>
      {/* Go Backdrop to set Modal horizontal position */}
      <div className='w-[21rem] pt-12 pb-4 min-h-fit rounded-md border-0'>
      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={loginTemp}
        validationSchema={isReg ? registrationSchema : loginSchema}
        onSubmit={async (value) => {
          // console.log(isReg);
          handleButtonStates('loginSignupButton', 'disable');
          handleWarningMsg('reset');

          // main routing logics
          try {
            // only send HTTP request if form has been modified or swtiched 
            // between login and registration
            if (
              JSON.stringify(prevForm.formData) !== JSON.stringify(value) ||
              JSON.stringify(prevForm.prevIsReg) !== JSON.stringify(isReg)
            ) {
              console.log('form modified!');
              const response = await axios.post('/api/authentication', { 
                value: value, 
                isReg: isReg
              });
              // json object returned by json does not persist??
              ({ loginResult, token, user } = response.data);


              // example of received user object, saved to context
              // {
              //   _id: new ObjectId("63ecabb23e2de88502535a60"),
              //   userName: 'admin',
              //   orders: [],
              //   creationTime: 2023-02-15T09:53:54.999Z
              // }

              console.log(loginResult);
              // update state with modified form data + new response
              setPrevForm({
                formData: value,
                prevLoginResult: loginResult,
                prevIsReg: isReg,
                hasChanged: true
              })
            } else {
              console.log('form has not been modified!');
              loginResult = prevForm.prevLoginResult;
              setPrevForm({
                ...prevForm,
                hasChanged: false
              })
            }
            switch (loginResult){
              case 0: // username not found
                setIsReg(!isReg);  // switch to signup state
                handleWarningMsg('loginUsernameFailure', 8500);
                dispatch({
                  type: 'loginFailure',
                  payload: {
                    user: null,
                    errMessage: 'No such user'
                  }
                });
                break;
              case 1: // login success
                console.log('login success');
                if (!prevForm.hasChanged) {
                  dispatch({
                    type: 'loginSuccess',
                    payload: {  // token is sent via cookie
                      user: user,  // save user to session context
                      errMessage: null
                    }
                  });
                  // useContext does not persist on refresh
                  if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                  }
                  setModalIsActive(!modalIsActive);  // close modal
                }
                break;
              case 2:
                handleWarningMsg('loginPasswordFailure', 8500);
                if (!prevForm.hasChanged) {
                  dispatch({  // dispatch when it was not a repeated request
                    type: 'loginFailure',
                    payload: {
                      user: null,
                      errMessage: 'Incorrect password'
                    }
                  });
                }
                break;
              case 3: // username already used
                handleWarningMsg('signUpUsernameFailure', 8500);
                dispatch({
                  type: 'loginFailure',
                  payload: {
                    user: null,
                    errMessage: 'Username already used'
                  }
                });
                break;
              case 4:
                console.log('signup success');
                if (!prevForm.hasChanged) {
                  dispatch({
                    type: 'loginSuccess',
                    payload: {
                      user: user,
                      errMessage: null
                    }
                  });
                  if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                  };
                  setModalIsActive(!modalIsActive);  // close modal
                };
                console.log(token);
                console.log(user);
                break;
              case 5:
                console.log('Logged out!');
                break;
              default:
                throw new Error(`Unexpected login result: ${loginResult}`);
            }
          } catch (err) {
            handleError(err);
          }
          handleButtonStates('loginSignupButton', 'enable');
        }}
      >
      {({ errors, values }) => (
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
            type="button"
          >x</button>
          {(elementStates.loginUsernameFailure) ? (
            <div className="font-bold text-red-600 text-[0.8rem] left-[7.5rem] top-7 absolute"
            >用戶不存在，請確認密碼以完成注冊
            </div>
          ) : null
          }
          {(elementStates.signUpUsernameFailure) ? (
            <div className="font-bold text-red-600 text-[0.8rem] left-[7.5rem] top-7 absolute"
            >用戶名稱已被注冊，請再試一次
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
          {elementStates.loginPasswordFailure ? (
            <div className="font-bold text-red-600 text-[0.8rem] left-[7.5rem] top-[5.3rem] absolute"
            >密碼不正確，請再試一次
            </div>
          ) : null
          }
          <div className="flex items-center justify-center gap-4">
          <label htmlFor="password"  className="basis-1/5">密碼</label>
            <Field
              className="h-8 rounded pl-2 passwordField"
              type={passwordShown ? 'text' : 'password'}
              id="password"
              name="passWord"
            />
            <button 
              className="absolute h-5 w-5 right-[2.6rem]"
              onClick={handleShowPassword}
              type='button'
            >
              {passwordShown ? <img src='/hide_pd_white.png'/>
              : <img src='/view_pd_white.png'/>}
            </button>
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
              <Field
                className="h-8 rounded pl-2 passwordField"
                type={passwordShown ? 'text' : 'password'}
                id="passwordConfirmation"
                name="passWordConfirmation"
              />
              <button 
                className="absolute h-5 w-5 right-[2.6rem]"
                onClick={handleShowPassword}
                type='button'
              >
                {passwordShown ? <img src='/hide_pd_white.png'/>
                : <img src='/view_pd_white.png'/>}
              </button>
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
                disabled={buttonDisabled.loginSignupButton}
                onClick={() => {
                  handleWarningMsg('reset');
                }}
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