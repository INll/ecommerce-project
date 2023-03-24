import { useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

export default function ItemForm() {
  const [ isViewing, setIsViewing ] = useState(false);  // toggle between tabs
  const [ submitting, setSubmitting ] = useState(false);  // after submitting; before received response
  const [ isDone, setIsDone ] = useState(false); // after receiving response; before start new button is clicked 
  const [ prompt, setPrompt ] = useState('');  // prompt user about submission result, edited in switch statment in submission handler 
  
  const initialForm = {  // initial form values
    price: '', file: '', title: '', type: '', desc: '', stock: ''
  };

  const MAX_FILE_SIZE_IN_MBS = 3;
  const MAX_FILE_SIZE = MAX_FILE_SIZE_IN_MBS * 1024 * 1024; // 3mb
  const formReqs = {
    title: { max: 50 },
    desc: { max: 300 },
    stock: null,
    price: null
  }

  const querySchema = Yup.object().shape({
    // https://stackoverflow.com/a/61485881/17974101                 accept no image
    file: Yup.mixed().test('fileSize', '檔案大小超過3MB, 請再試一次', (value) => !value || value.size <= MAX_FILE_SIZE),
    title: Yup.string()
    .max(formReqs.title.max, `必須少於 ${formReqs.title.max} 個字符`)
    .required('此項不能爲空'),
    desc: Yup.string()
    .max(formReqs.desc.max, `必須少於 ${formReqs.desc.max} 個字符`)
    .required('此項不能爲空'),
    type: Yup.mixed()
    .required('請選擇種類'),  // tried notOneOf(['']), doesn't work 
    stock: Yup.number()
    .positive('此項不能爲負數').integer('此項只接受整數').required('此項不能爲空'),
    price: Yup.number()
    .positive('此項不能爲負數').integer('此項只接受整數').required('此項不能爲空'),
  });

  function handleError (err, res) {
    console.log(`Error: ${err}`);
    console.log(err.stack);
  }

  async function handleSubmit(values) {
    try {
      const response = await axios.post('/api/admin/post/item/new', { 
        price: values.price,
        title: values.title,
        type: values.type,
        desc: values.desc,
        stock: values.stock,
        file: values.file,
       }, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSubmitting(!submitting);  // This does not work??
      console.log('response' + response.data.result);

      switch(response.data.result) {
        case 0:  // unknown error
          setPrompt('未知錯誤, 請再試一次。');
          break;
        case 1:  // success
          setPrompt(`商品新增成功! `);
          break;
        case 2:  // reached upload limit
          setPrompt(`錯誤: 此帳號沒有權限新增更多商品。`);
          break;
        default:
          throw new Error('Unknown firebase upload result code');
      }
      console.log('setDone: ' + isDone);
      setSubmitting(!submitting);
      setIsDone(!isDone);  // this displays prompt
    } catch (err) {
      handleError(err);
    }
  }

  return (
    <>
      <div className='bg-stone-700/20 h-fit rounded-b-[0.25rem] rounded-tr-[0.25rem] relative'>
        <div className="flex absolute items-end bottom-[100%] gap-1">
          </div>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={initialForm}
            validationSchema={querySchema}
            onSubmit={async (values) => {
              setSubmitting(!submitting);
              handleSubmit(values);
            }}
          >
          {({ setFieldValue, errors, values, handleChange, resetForm }) => (
            <Form id='form' className='flex flex-col h-full w-full'>
              {submitting 
                ? <div className='flex flex-col h-full w-full absolute bg-stone-900/60 z-10'>
                    <div className="relative h-full w-full">
                      <svg className="absolute animate-spin -ml-1 mr-3 h-8 w-8 left-[47%] top-[42%] text-white z-20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                : null
              }
              {isDone
                ? <div className='flex flex-col h-full w-full absolute bg-stone-800 z-10'>
                    <div className="flex flex-col justify-center items-center h-full w-full gap-3">
                      <div className="text-xl tracking-wider">{prompt}</div>
                      <button type='button' className='mt-6 font-bold rounded-[0.275rem] border-[2px] py-2 px-5 tracking-widest border-amber-400 
                        active:border-amber-700 transition-colors hover:bg-amber-400 active:bg-amber-500 disabled:border-amber-700 disabled:bg-amber-500'
                        onClick={() => {
                          setIsDone(false);
                          setSubmitting(false);
                          resetForm();
                        }}
                        >繼續</button>
                    </div>
                  </div>
                : null
              }
              <div className='flex flex-col my-4 w-full md:w-auto md:my-0 md:flex-row md:h-[15rem]'>
                <div className='relative flex h-full w-full md:w-[40%] items-center justify-center'>
                  <label htmlFor='fileUpload' className='bg-stone-600/20 rounded-[0.4rem] w-full mx-4 md:w-48 h-48 cursor-pointer px-auto'> 
                    {/* whitespace pre + '\00000a' can make line breaks in pseudoelements */}
                    {values.file 
                    ? null
                    : <div className='relative text-stone-400 mx-auto h-full pt-[4.5rem] md:pt-[42%] text-lg text-center pointer-events-none'>
                        按此上載預覽圖
                        <ul className='text-left text-stone-400/60 left-[50%] -ml-16 md:ml-0 md:left-8 text-sm absolute top-[57%] whitespace-pre italic'>
                          <li>- 只限一張</li>
                          <li>- 須小於{MAX_FILE_SIZE_IN_MBS}mb</li>
                          <li>- 只接受.png格式</li>
                        </ul>
                      </div>
                    }
                  </label>
                  <input value='' type="file" name='file' accept=".png" id="fileUpload" className='hidden' onChange={(e) => {
                    setFieldValue('file', e.currentTarget.files[0]);
                  }}/>
                  {errors.file 
                    ? <div className='font-bold text-red-600 text-[0.8rem] absolute left-[1.8rem] top-[13.6rem]'>{errors.file}</div>
                    : null}
                  {values.file
                  ? <div className='absolute flex items-center justify-center h-full w-full pointer-events-none'>
                      <img src={URL.createObjectURL(values.file)} alt='itemThumbnail' className='max-w-[80%] max-h-[80%] px-auto pointer-events-none'></img>
                    </div>
                  : null }
                </div>
                <ul className='px-8 mt-6 md:mt-0 md:w-[60%] h-full flex flex-col justify-center gap-5'>
                  <li className='md:w-[90%] flex flex-col gap-2 relative'>
                    <label htmlFor="title">商品名稱 (少於50字)</label>
                    <Field type='text' name='title' id='title' className='rounded px-1 h-8 bg-stone-600/40' onChange={handleChange} value={values.title}/>
                    {errors.title 
                    ? <div className='font-bold text-red-600 text-[0.8rem] absolute top-[4.05rem]'>{errors.title}</div>
                    : null}
                  </li>
                  <li className='md:w-[90%] flex flex-col gap-2 relative'>
                    <label htmlFor="desc">商品描述 (少於300字)</label>
                    <Field as='textarea' name='desc' id='desc' className='rounded px-1 h-[4.8rem] resize-none bg-stone-600/40' onChange={handleChange} value={values.desc}/>
                    {errors.desc 
                    ? <div className='font-bold text-red-600 text-[0.8rem] absolute top-[6.9rem]'>{errors.desc}</div>
                    : null}
                  </li>
                </ul>
              </div>
              <ul className='flex flex-col gap-7 md:grid md:grid-cols-12 md:gap-0 items-center h-fit px-8 pt-1 pb-7'>
                <li className='flex items-center col-span-4 mt-2 md:mt-0 gap-3 w-full relative'>
                  <label htmlFor="type" className='w-[40%] md:w-auto'>商品種類</label>
                  <Field as='select' name='type' id='type' className='h-8 bg-stone-600/40 rounded w-full md:w-[5.5rem] pl-2' onChange={handleChange} value={values.type}>
                    <option value='' className='bg-stone-800/40'>請選擇</option>
                    <option value="shoes" className='bg-stone-800/40'>鞋</option>
                    <option value="accessories" className='bg-stone-800/40'>飾品</option>
                    <option value="hats" className='bg-stone-800/40'>帽</option>
                    <option value="bottoms" className='bg-stone-800/40'>褲</option>
                    <option value="outers" className='bg-stone-800/40'>上衣</option>
                  </Field>
                  {errors.type 
                    ? <div className='font-bold text-red-600 text-[0.8rem] absolute left-[30.3%] md:left-[4.8rem] top-[2.15rem]'>{errors.type}</div>
                    : null}
                </li>
                <li className='flex items-center w-full md:w-auto col-span-3 gap-2 relative'>
                  <label htmlFor="stock" className='w-[40%] md:w-auto md:absolute'>庫存</label>
                  <Field type='number' name='stock' id='stock' className='h-8 bg-stone-600/40 rounded w-full md:w-24 ml-1 md:ml-12 pl-2' 
                    onChange={handleChange} value={values.stock} onWheel={(e) => e.target.blur()} onKeyDown={(e) => {(e.key === 'e' || e.key === '.') && e.preventDefault()}}
                  ></Field>
                  {errors.stock 
                    ? <div className='font-bold text-red-600 text-[0.8rem] absolute left-[30.3%] md:left-[3rem] top-[2.1rem]'>{errors.stock}</div>
                    : null}
                </li>
                <li className='flex items-center w-full md:w-auto col-span-5 gap-3 md:ml-6 relative'>
                  <label htmlFor="price" className='w-[40%] md:w-auto md:absolute'>零售價</label>
                  <Field type='number' name='price' id='price' className='h-8 bg-stone-600/40 rounded w-full md:w-[6.1rem] ml-4 md:ml-16 pl-2'
                   onChange={handleChange} value={values.price} onWheel={(e) => e.target.blur()} onKeyDown={(e) => {(e.key === 'e' || e.key === '.') && e.preventDefault()}}
                  ></Field>HKD
                  {errors.price 
                    ? <div className='font-bold text-red-600 text-[0.8rem] absolute left-[30.3%] md:left-[4rem] top-[2.1rem]'>{errors.price}</div>
                    : null}
                </li>
              </ul>
            </Form>
          )}
        </Formik>
      </div>
      <button form='form' type='submit' disabled={submitting}  // do not set onClick={setState} here, it will prevent form submission
        className='mt-2 ml-auto font-bold rounded-[0.275rem] border-[2px] py-2 px-5 tracking-wide border-cyan-400 w-full sm:w-auto
        active:border-cyan-700 transition-colors hover:bg-cyan-400 active:bg-cyan-500 disabled:border-cyan-700 disabled:bg-cyan-500'
      >提交</button>
    </>
  )
}