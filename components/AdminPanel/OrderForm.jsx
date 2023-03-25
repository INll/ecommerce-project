import { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import OrderItem from './OrderItem';
import OrderDetails from './OrderDetails';
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

  const initialForm = { id1: '', id2: '', id3: '' };
  const formReqs = { id1: { min: 4 }, id2: { min: 6 }, id3: { min: 4 } };
  const orderDetailsColSpans = [3, 5, 1, 2, 1];
  const orderDetailsColNames = ['預覽圖', '名稱', '類別', '價格', '數量'];

  function handleError (err, res) {
    console.error(`Error: ${err}`);
    console.log(err.stack);
  }


  async function handleSubmit(values) {
    let id = Object.keys(values).map((key) => values[key]).join('');  // convert three seperate field values into single string
    try {
      const response = await axios.post('/api/admin/fetch/order/get', {
        id: id
      })

      switch(response.data.result) {
        case 0:
          setState(2, false);
          setState(3, `無效訂單編號。`);
          break;
        case 1:
          setState(2, true);
          console.log(response.data);
          setState(4, response.data);
          break;
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

  const isNotANumber = /^\D$/;  // input type = string, number escapes zeros

  const querySchema = Yup.object().shape({
    id1: Yup.string().min(formReqs.id1.min, `格式錯誤, 請核對字符數。`).required(`格式錯誤, 請核對字符數。`),
    id2: Yup.string().min(formReqs.id2.min, `格式錯誤, 請核對字符數。`).required(`格式錯誤, 請核對字符數。`),
    id3: Yup.string().min(formReqs.id3.min, `格式錯誤, 請核對字符數。aa`).required(`格式錯誤, 請核對字符數。`)
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
            <Form id='orderForm' className='w-full h-full flex justify-center items-center'>
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
                  ? <div className='w-[80%] py-9'>
                      <OrderDetails orderDetails={response.orderDetails} user={response.username}/>
                      <ul className='mt-8 sm:mt-5 mb-10 grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] sm:flex sm:flex-col justify-center items-center h-fit gap-[1.5rem] sm:gap-[0.7rem]'>
                        <ul className='hidden sm:static sm:visible pr-4 sm:grid sm:grid-cols-12 w-full h-10 text-center items-center text-lg'>
                          <li className={`col-span-${orderDetailsColSpans[0]}`}>{orderDetailsColNames[0]}</li>
                          <li className={`col-span-${orderDetailsColSpans[1]}`}>{orderDetailsColNames[1]}</li>
                          <li className={`w-9 col-span-${orderDetailsColSpans[2]}`}>{orderDetailsColNames[2]}</li>
                          <li className={`col-span-${orderDetailsColSpans[3]}`}>{orderDetailsColNames[3]}</li>
                          <li className={`w-9 col-span-${orderDetailsColSpans[4]}`}>{orderDetailsColNames[4]}</li>
                        </ul>
                        {response.itemDetails.map((item) => {
                          return (    
                            <OrderItem key={item._id} item={item} orderDetails={response.orderDetails.itemID} colSpan={orderDetailsColSpans}/>
                          )
                        })}
                      </ul>
                    </div>
                  : <div className='flex flex-col h-full w-full absolute bg-stone-800 z-10'>
                      <div className="flex flex-col justify-center items-center h-full w-full gap-3">
                        <div className="text-xl tracking-wider">{prompt}</div>
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
                : <div className='my-8 md:mt-0 md:mb-0 w-full'>
                    {/* <div className='relative text-center w-full tracking-wider text-xl mb-8 md:mb-0'>
                      輸入訂單編號
                      <div className='absolute text-center w-full tracking-wider text-sm italic md:left-[9.5rem] md:top-2 text-stone-400'>(格式: xxxx-xxxxxx-xxxx)</div>
                    </div> */}
                    <div className='relative flex justify-center tracking-wider text-xl mb-8 md:mb-0'>
                      輸入訂單編號
                      <div className='absolute tracking-wider text-sm italic top-8 md:pl-[19rem] md:top-2 text-stone-400'>(格式: xxxx-xxxxxx-xxxx)</div>
                    </div>
                    <div className="relative flex flex-col md:flex-row mb-4 justify-center items-center gap-3 w-full h-fit mt-4">
                    <div className='md:hidden mb-2 mt-4 text-base'>第一部分</div>
                      {/* maxLength does not work on type='number': https://stackoverflow.com/a/34641129/17974101 */}
                      <Field type='string' name='id1' id='id1' className='rounded pl-3 pb-1 h-[3.2rem] text-4xl bg-stone-600/40 w-[6.75rem] font-medium'
                        onChange={handleChange} value={values.id1}
                        onInput={(e) => {e.target.value = e.target.value.slice(0, 4)}}                // slice to only four digits
                        onKeyDown={(e) => {(isNotANumber.test(e.key) && e.preventDefault())}}         // prevent entering non-digit chars
                        onWheel={(e) => e.target.blur()}                                              // prevent wheel from changing value
                      />
                      {(errors.id1 || errors.id2 || errors.id3)
                        ? <div className='font-bold text-red-600 text-[1rem] absolute top-[91%] left-[0%]'>{errors.id1 || errors.id2 || errors.id3}</div>
                        : null}
                      <div className='hidden md:inline-block pb-2 text-4xl'>-</div>
                      <div className='md:hidden mb-2 mt-4 text-base'>第二部分</div>
                      <Field type='string' name='id2' id='id2' className='rounded pl-3 pb-1 h-[3.2rem] text-4xl bg-stone-600/40 w-[9.3rem] font-medium'
                        onChange={handleChange} value={values.id2}
                        onInput={(e) => {e.target.value = e.target.value.slice(0, 6)}}
                        onKeyDown={(e) => {(isNotANumber.test(e.key) && e.preventDefault())}}
                        onWheel={(e) => e.target.blur()}
                      />
                      <div className='hidden md:inline-block pb-2 text-4xl'>-</div>
                      <div className='md:hidden mb-2 mt-4 text-base'>第三部分</div>
                      <Field type='string' name='id3' id='id3' className='rounded pl-3 pb-1 h-[3.2rem] text-4xl bg-stone-600/40 w-[6.75rem] font-medium'
                        onChange={handleChange} value={values.id3}
                        onInput={(e) => {e.target.value = e.target.value.slice(0, 4)}}
                        onKeyDown={(e) => {(isNotANumber.test(e.key) && e.preventDefault())}}
                        onWheel={(e) => e.target.blur()}
                      />
                    </div>
                  </div>
              }
            </Form>
          )}
        </Formik>
      </div>
      {isSuccess 
      ? <ScrollLink to="secondSection" className='w-full' smooth={true} duration={300} offset={-50}>
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
          >查詢新訂單</button>
        </ScrollLink>
      : <button form='orderForm' type='submit' disabled={submitting || isDone}  // do not set onClick={setState} here, it will prevent form submission
        className='mt-2 ml-auto font-bold rounded-[0.275rem] border-[2px] py-2 px-5 tracking-wide border-cyan-400 w-full sm:w-auto
        active:border-cyan-700 transition-colors hover:bg-cyan-400 active:bg-cyan-500 disabled:border-cyan-700 disabled:bg-cyan-500'
        >提交</button>
      }
    </>
  )
}