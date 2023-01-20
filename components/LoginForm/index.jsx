import { React, useContext, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { LoginFormContext } from "../Contexts/LoginFormContext";

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
  .matches(/^(?=.{8,20}$)(([a-z0-9])\2?(?!\2))+$/, '密碼不得含有連續字符')
  .required('此項不能爲空'),
  passWordConfirmation: Yup.string()
  .min(loginReqs.password.min, `必須多於 ${loginReqs.password.min} 個字符`)
  .max(loginReqs.password.max, `必須少於 ${loginReqs.password.max} 個字符`)
  .matches(/[0-9]/, '密碼必須包含至少一個數字')
  .matches(/[a-z]/, '密碼必須包含至少一個細楷英文字母')
  .matches(/[A-Z]/, '密碼必須包含至少一個大楷英文字母')
  .matches(/^(?=.{8,20}$)(([a-z0-9])\2?(?!\2))+$/, '密碼不得含有連續字符')
  .required('此項不能爲空'), 
})

export default function index({ onClick, loginTemp, saveLoginInfo, isReg, setIsReg }) {
  // const [isReg, setUserRegister] = useState(false);

  return (
    <div>
      {/* Go Backdrop to set Modal horizontal position */}
      <div className='w-[21rem] pt-12 pb-4 min-h-fit rounded-md border-0'>
      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={loginTemp}
        validationSchema={isReg ? registrationSchema : loginSchema}
        onSubmit={values => {
          console.log(values);
        }}
      >
      {({ errors, touched, values }) => (
        <Form 
          className="flex flex-col w-auto gap-6"
          onKeyUp={() => {
            console.log('Updating state');
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
          <div className="flex items-center justify-center gap-4">
            <label htmlFor="username" className="basis-1/5">用戶名稱</label>
            <Field
              className="h-8 rounded pl-2 relative"
              id="username"
              name="userName"
            />
            {errors.userName ? (
              <div
                className="font-extrabold text-red-600 text-[0.8rem] absolute left-[7.15rem] top-[1.75rem]"
              >{errors.userName}</div>
             ) : null
            }
          </div>
          <div className="flex items-center justify-center gap-4">
          <label htmlFor="password"  className="basis-1/5">密碼</label>
            <Field
              className="h-8 rounded pl-2"
              type="password"
              id="password"
              name="passWord"
            />
            {errors.passWord ? (
              <div
                className="font-extrabold text-red-600 text-[0.8rem] absolute left-[7.15rem] top-[5.3rem]"
              >{errors.passWord}</div>
             ) : null
            }
          </div>
          {isReg ? 
            <div className="flex items-center justify-center gap-4">
            <label htmlFor="passwordConfirmation"  className="basis-1/5">確認密碼</label>
              <Field
                className="h-8 rounded pl-2"
                type="password"
                id="passwordConfirmation"
                name="passWordConfirmation"
              />
              {errors.passWordConfirmation ? (
                <div
                  className="font-extrabold text-red-600 text-[0.8rem] absolute left-[7.15rem] top-[8.8rem]"
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
                font-bold py-2 px-3 rounded"
                type="submit"
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