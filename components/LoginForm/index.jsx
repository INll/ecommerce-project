import { React, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function index({ onClick }) {
  const [userRegister, setUserRegister] = useState(false);

  return (
    <div>
      {/* Go Backdrop to set Modal horizontal position */}
      <div className='w-[21rem] pt-12 pb-4 min-h-fit rounded-md border-0'>
      <Formik
        initialValues={{ 
          email: '',
          password: '',
        }}
        onSubmit={{
          
        }}
        
      >
        <Form className="flex flex-col w-auto gap-4">
          <button className="absolute text-white-500 font-bold text-2xl top-[-0.1rem] 
            right-3 px-1 pt-1 pb-1"
            onClick={onClick}
          >x</button>
          <div className="flex items-center justify-center gap-4">
            <label htmlFor="username" className="basis-1/5">用戶名稱</label>
            <Field
              className="h-8 rounded pl-2"
              id="username"
              name="username"
              placeholder="必塡"
            />
          </div>
          <div className="flex justify-center gap-4">
          <label htmlFor="password"  className="basis-1/5">密碼</label>
            <Field
              className="h-8 rounded pl-2"
              type="password"
              id="password"
              name="password"
              placeholder="必塡"
            />
          </div>
          <div className="flex justify-center relative">
            {userRegister ? <button
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
              onClick={() => setUserRegister(!userRegister)}
            >
              {userRegister ? '登入' : '注冊'}
            </button>
          </div>
        </Form>
      </Formik>
      </div>
    </div>
  )
}

{/* <h1 className="heading1">Login</h1>
<div className="heading2">And Benefit</div>
<div className="email"></div>
<div className="password"></div>
<div className="buttons"></div> */}
