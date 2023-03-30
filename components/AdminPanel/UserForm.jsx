import { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import UserDetails from './UserDetails';
import * as Scroll from 'react-scroll';

let ScrollLink = Scroll.Link;

export default function OrderForm() {
  const [ submitting, setSubmitting ] = useState(false);  // after submitting; before received response
  const [ isDone, setIsDone ] = useState(false); // after receiving response; before start new button is clicked 
  const [ isSuccess, setIsSuccess ] = useState(false); // determines if either error page or order detail page is shown
  const [ prompt, setPrompt ] = useState('');
  const [ response, setResponse ] = useState('');

  const formRef = useRef(null);

  // used in async api callbacks
  const setFuncs = [ setSubmitting, setIsDone, setIsSuccess, setPrompt, setResponse ];
  function setState(func, param) {
    setFuncs[func](param);
  }

  const initialForm = { username: '' };
  const formReqs = { username: { min: 2, max: 15 }}

  function handleError (err, res) {
    console.error(`Error: ${err}`);
    console.log(err.stack);
  }

  async function handleSubmit(values) {
    try {
      const response = await axios.post('/api/admin/fetch/user/get', {
        username: values.username
      })

      switch(response.data.result) {
        case 0:
          setState(2, false);
          setState(3, `查無此用戶。`);
          break;
        case 1:
          setState(2, true);
          setState(4, response.data.userDetails);
          break;
        case 2:
          setState(2, false);
          setState(3, `未知錯誤, 請再試一次。`);
        default:
          throw new Error('Unknown order query response code');
      }
      // users should not see an empty screen
      setState(0, false);
      setState(1, true);
    } catch (err) {
      handleError(err);
    }
  };

  const querySchema = Yup.object().shape({
    username: Yup.string()
      .min(formReqs.username.min, `格式錯誤, 用戶名稱至少包含${formReqs.username.min}個字符。`)
      .max(formReqs.username.max, `格式錯誤, 用戶名稱不可超過${formReqs.username.max}個字符。`)
      .required(`格式錯誤, 請核對字符數。`),
  });

  return (
    <>
      <div className='relative bg-stone-700/20 flex items-center min-h-[16rem] rounded-b-[0.25rem] rounded-tr-[0.25rem]'>
        <Formik
          innerRef={formRef}
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={initialForm}
          validationSchema={querySchema}
          onSubmit={async (values) => {
            setSubmitting(!submitting);
            handleSubmit(values);
          }}
        >
          {({ errors, values, resetForm, handleChange }) => (
            <Form id='userForm' className='w-full h-full flex justify-center items-center'>
              {submitting 
                ? <div className='flex flex-col h-full w-full absolute bg-stone-900/60 z-30 pointer-events-auto'>
                    <div className="relative h-full w-full">
                      <svg className="absolute animate-spin -ml-1 mr-3 h-8 w-8 left-[47%] top-[44%] text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                : null
              }
              {isDone
                ? isSuccess  // can either display order details or error message
                  ? <div className='w-[80%] py-8'>
                      <UserDetails userDetails={response}/>
                    </div>
                  : <div className='flex flex-col h-full w-full absolute bg-stone-800 z-10'>
                      <div className="flex flex-col justify-center items-center h-full w-full gap-3">
                        <div className="text-xl ml-2 tracking-wider">{prompt}</div>
                        <button type='button' className='mt-6 font-bold rounded-[0.275rem] border-[2px] py-2 px-5 tracking-widest border-amber-400 
                          active:border-amber-700 transition-colors hover:bg-amber-400 active:bg-amber-500 disabled:border-amber-700 disabled:bg-amber-500'
                          onClick={() => {
                            setState(2, false);
                            setState(1, false);
                            setState(4, '');
                            resetForm();
                          }}
                          >再試一次</button>
                      </div>
                    </div>
                : <div className='relative mb-6'>
                    <div className='relative text-center w-full tracking-wider text-xl'>
                      輸入用戶名稱
                    </div>
                    <div className="flex mb-4 justify-center items-center gap-3 w-full h-fit mt-4">
                      {/* maxLength does not work on type='number' */}
                      {/* https://stackoverflow.com/a/34641129/17974101 */}
                      <Field type='text' name='username' id='username' className='rounded pb-1 h-[3.2rem] text-4xl bg-stone-600/40 w-1/2 sm:w-2/3 md:w-96 font-medium text-center'
                        onChange={handleChange} value={values.username} onKeyDown={(e) => {(e.key === ' ') && e.preventDefault()}}
                        onInput={(e) => {e.target.value = e.target.value.slice(0, 15)}}
                      />
                      {(errors.username)
                        ? <div className='font-bold text-red-600 text-[1rem] text-center absolute top-[91%] left-[0%]'>{errors.username}</div>
                        : null}
                    </div>
                  </div>
              }
            </Form>
          )}
        </Formik>
      </div>
      {isSuccess 
      ? <ScrollLink to="thirdSection" className='w-full' smooth={true} duration={300} offset={-50}>
          <button type='button' className='mt-6 mb-2 w-full font-bold rounded-[0.275rem] border-[2px] py-2 px-5 tracking-widest border-amber-400 
          active:border-amber-700 transition-colors hover:bg-amber-400 active:bg-amber-500 disabled:border-amber-700 disabled:bg-amber-500'
            onClick={(e) => {  // query new order
              e.preventDefault();
              setState(0, false);
              setState(1, false);
              setState(2, false);
              setState(3, '');
              setState(4, '');
              formRef.current.resetForm();
          }}
          >查詢新用戶</button>
        </ScrollLink>
      : <button form='userForm' type='submit' disabled={submitting || isDone}  // do not set onClick={setState} here, it will prevent form submission
        className='mt-2 ml-auto font-bold rounded-[0.275rem] border-[2px] py-2 px-5 tracking-wide border-cyan-400 w-full sm:w-auto
        active:border-cyan-700 transition-colors hover:bg-cyan-400 active:bg-cyan-500 disabled:border-cyan-700 disabled:bg-cyan-500'
        >提交</button>
      }
    </>
  )
}