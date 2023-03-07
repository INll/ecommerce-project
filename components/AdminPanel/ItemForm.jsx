import { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

export default function ItemForm() {
  const [ isViewing, setIsViewing ] = useState(false);  // toggle between tabs
  const [ draft, setDraft ] = useState({  // store unsubmitted data
    price: '',
    file: '',
    title: '',
    type: '',
    description: '',
    stock: ''
  });
  
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3mb
  const formReqs = {
    title: { max: 50 },
    desc: { max: 300 },
    stock: null,
    price: null
  }

  const querySchema = Yup.object().shape({
    file: Yup.mixed()
    .test('fileSize', '檔案大小超過3MB, 請再試一次', (values) => values && values.size <= MAX_FILE_SIZE)
    .required('此項不能爲空'),
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

  function handleToggleView() {
    setIsViewing(!isViewing);
  }

  function handleError (err, res) {
    console.log(`Error: ${err}`);
    console.log(err.stack);
  }

  async function handleSubmit(values) {
    try {
      console.log('submitting');
      const response = await axios.post('/api/admin/post/new', {values});
      console.log(response);
    } catch (err) {
      handleError(err);
    }
  }

  return (
    <>
      <div className='bg-stone-700/20 h-fit rounded-b-[0.25rem] rounded-tr-[0.25rem] mt-10 relative'>
        <div className="flex absolute items-end bottom-[100%] gap-1">
          <button onClick={handleToggleView} 
            className={`${isViewing ? 'bg-stone-600/[0.05] text-gray-400' : 'pointer-events-none'} bg-stone-700/20 h-11 text-xl px-8 rounded-t-md 
            hover:bg-gradient-to-b from-stone-400/20 via-stone-600/20 to-stone-700/20`}>新 增</button>
          <button onClick={handleToggleView} 
            className={`${isViewing ? 'pointer-events-none' : 'bg-stone-600/[0.05] text-gray-400'} bg-stone-700/20 h-11 text-xl px-8 rounded-t-md 
            hover:bg-gradient-to-b from-stone-400/20 via-stone-600/20 to-stone-700/20`}>瀏 覽</button>
          </div>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={draft}
            validationSchema={querySchema}
            onSubmit={handleSubmit}
          >
          {({ setFieldValue, errors, values, handleChange }) => (
            <Form id='form' className='flex flex-col h-full w-full'
              onKeyUp={() => {
                setDraft({
                  ...draft,
                  file: values.file,
                  price: values.price,
                  title: values.title,
                  type: values.type,
                  description: values.desc,
                  stock: values.stock
                });
              }}
              onSubmit={(values) => {
                console.log(values);
              }}
            >
              <div className='flex h-[15rem]'>
                <div className='relative flex h-full w-[40%] items-center justify-center'>
                  <label htmlFor='fileUpload' className='bg-stone-600/20 rounded-[0.4rem] w-48 h-48 cursor-pointer px-auto'> 
                    {/* whitespace pre + '\00000a' can make line breaks in pseudoelements */}
                    {values.file 
                    ? null
                    : <div className='relative text-stone-400 w-full h-full pt-[42%] text-lg text-center pointer-events-none'>
                        按此上載預覽圖 
                        <ul className='text-left text-stone-400/60 left-8 text-sm absolute top-[57%] whitespace-pre italic'>
                          <li>- 只限一張</li>
                          <li>- 須小於10mb</li>
                          <li>- 只接受.png格式</li>
                        </ul>
                      </div>
                    }
                  </label>
                  <input value='' type="file" name='file' accept=".png" id="fileUpload" className='hidden' onChange={(e) => {
                    setFieldValue('file', e.currentTarget.files[0]);
                  }}/>
                  {values.file
                  ? <img src={URL.createObjectURL(values.file)} alt='itemThumbnail' className='max-w-[12rem] px-auto absolute pointer-events-none'></img>
                  : null }
                </div>
                <ul className='w-[60%] h-full flex flex-col justify-center gap-5'>
                  <li className='w-[90%] flex flex-col gap-2 relative'>
                    <label htmlFor="title">商品名稱 (少於50字)</label>
                    <Field type='text' name='title' id='title' className='rounded px-1 h-8 bg-stone-600/40' onChange={handleChange} value={values.title}/>
                    {errors.title 
                    ? <div className='font-bold text-red-600 text-[0.8rem] absolute top-[4.05rem]'>{errors.title}</div>
                    : null}
                  </li>
                  <li className='w-[90%] flex flex-col gap-2 relative'>
                    <label htmlFor="desc">商品描述 (少於300字)</label>
                    <Field as='textarea' name='desc' id='desc' className='rounded px-1 h-[4.8rem] resize-none bg-stone-600/40' onChange={handleChange} value={values.desc}/>
                    {errors.desc 
                    ? <div className='font-bold text-red-600 text-[0.8rem] absolute top-[6.9rem]'>{errors.desc}</div>
                    : null}
                  </li>
                </ul>
              </div>
              <ul className='grid grid-cols-12 items-center h-fit px-7 pt-1 pb-7 gap-0'>
                <li className='flex items-center col-span-4 gap-3 w-full relative'>
                  <label htmlFor="type">商品種類</label>
                  <Field as='select' name='type' id='type' className='h-8 bg-stone-600/40 rounded w-[5.5rem] pl-2' onChange={handleChange} value={values.type}>
                    <option value='' className='bg-stone-800/40'>請選擇</option>
                    <option value="shoes" className='bg-stone-800/40'>鞋</option>
                    <option value="accessories" className='bg-stone-800/40'>飾品</option>
                    <option value="hats" className='bg-stone-800/40'>帽</option>
                    <option value="jeans" className='bg-stone-800/40'>褲</option>
                    <option value="shirts" className='bg-stone-800/40'>上衣</option>
                  </Field>
                  {errors.type 
                    ? <div className='font-bold text-red-600 text-[0.8rem] absolute left-[4.8rem] top-[2.15rem]'>{errors.type}</div>
                    : null}
                </li>
                <li className='flex items-center col-span-3 gap-3 relative'>
                  <label htmlFor="stock" className='w-fit'>庫存</label>
                  <Field type='number' name='stock' id='stock' className='h-8 bg-stone-600/40 rounded w-24 pl-2' onChange={handleChange} value={values.stock}></Field>
                  {errors.stock 
                    ? <div className='font-bold text-red-600 text-[0.8rem] absolute left-[2.7rem] top-[2.1rem]'>{errors.stock}</div>
                    : null}
                </li>
                <li className='flex items-center col-span-5 gap-3 ml-6 relative'>
                  <label htmlFor="price" className='w-fit'>零售價</label>
                  <Field type='number' name='price' id='price' className='h-8 bg-stone-600/40 rounded w-[6.1rem] pl-2' onChange={handleChange} value={values.price}></Field>HKD
                  {errors.price 
                    ? <div className='font-bold text-red-600 text-[0.8rem] absolute left-[3.7rem] top-[2.1rem]'>{errors.price}</div>
                    : null}
                </li>
              </ul>
            </Form>
          )}
        </Formik>
      </div>
      <button form='form' type='submit' className='mt-2 ml-auto font-bold rounded-[0.275rem] border-[2px] py-2 px-5 tracking-wide border-cyan-400 active:border-cyan-700 transition-colors hover:bg-cyan-400 active:bg-cyan-500'>確認變更</button>
    </>
  )
}
