import { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuthDispatch, useAuthState } from '@/contexts/AuthContext';
import Recommendation from './Recommendation';
import Skeleton from './Skeleton';
import Image from 'next/image';
import AddToCart from './AddToCart';

const catDict = { 
  'shoes': '鞋',
  'accessories': '飾品',
  'bottoms': '下裝',
  'hats': '帽',
  'outers': '外套'
}

export default function ItemPage({ itemID }) {

  const [readingMore, setReadingMore] = useState(false);

  // read session
  const router = useRouter();
  const dispatch = useAuthDispatch();
  const session = useAuthState();

  const fetchItemQueryFn = async ({ queryKey }) => {
    try {
      const { data } = await axios.get(queryKey[0], { params: queryKey[1]} );
      if (data.result === 2) {
        dispatch({
          type: 'updateFav',
          payload: { user: data.user, errMessage: null }
        });
      }
      return data;
    } catch (err) {
      console.log(err.stack);
      throw new Error(err);
    }
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['/api/public/fetch/itemPageData', { itemID: itemID }],
    queryFn: fetchItemQueryFn
  })

  const mutation = useMutation(async (reqPayload) => {
    const path = reqPayload.buttonId === 'likeButton' ? 'likeItem' : 'unlikeItem';
    return await axios.post(`/api/protected/post/${path}`, reqPayload);
  }, { onSuccess: (res) => {
    switch(res.data.result) {
      case 0:
        throw new Error(res.data.message);
      case 1:
        dispatch({
          type: 'updateFav',
          payload: {
            user: res.data.user,
            errMessage: null
          }
        });
        break;
      case 2:
        throw new Error(res.data.message);
      default:
        throw new Error('Unknown result code');
    }
  }, onError: (err) => {
    console.error(err);
    console.log(err.stack);
  }});

  if (isLoading) {
    return (
      <Skeleton />
    )
  }

  return (
    <>
      {/* breakpoints: sm lg xl */}
      <div className="h-[100vh] w-[100vw] -z-10 fixed">
        <Image alt='background image' priority={true} src="/dashboard-background.png" quality={100}
          fill={true} sizes="100vw" className='object-fill absolute'
        />
      </div>
      <div className='h-0 lg:h-32'></div>
        {data?.data.stock < 50 
          ? <div className='relative h-fit w-full text-center bg-neutral-600/80 mt-4 sm:mt-0 md:mt-3 lg:bottom-32 py-3'>只剩<span className='font-bold text-yellow-300'> {data?.data.stock} </span>件, 欲購從速! </div> 
          : null
        }
      <div className='max-w-full lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl bg-neutral-800/80 lg:rounded-md xl:rounded-xl mx-auto px-8 sm:px-12 md:px-20 lg:px-20 xl:px-24 pt-8 pb-14 sm:py-[4.6rem]'>
        <div className='flex flex-col'>
          <div className='flex flex-col items-center gap-3 sm:flex-row sm:gap-10 sm:h-full sm:items-start'>
            {data?.data.images
              ? <img src={`${data?.data.images.url}`} alt={`Image of ${data?.data.images.title}`} className='rounded-lg bg-neutral bg-zinc-600/20 w-full h-auto sm:w-[40%] sm:mt-4' />
              : <div className="flex w-full h-full justify-center object-cover py-[5%]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-[20%]">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
            }
            <div className='sm:flex-col w-full'>
              <div className='py-3 tracking-wider text-2xl w-full'>{data?.data.title}</div>
              <div className='pr-3 flex items-end justify-end w-full'>
              <span className='pb-2'>港幣&nbsp;&nbsp;</span>
              <span className='text-[2.5rem] font-bold'>{data?.data.price}</span>
              <span className='pb-2'>&nbsp;元</span>
              </div>
              {data?.data.description.length < 110
              ? ( 
                  <div className='relative py-3 tracking-wider h-fit overflow-hidden w-full break-all'>
                    {data?.data.description}
                  </div>
                )
              : (
                  <div className={`relative py-3 tracking-wider ${readingMore ? 'h-fit': 'h-44'} overflow-hidden w-full`}>
                    {data?.data.description}
                    <div className={`${readingMore ? 'static my-': 'absolute'} bottom-0 z-10 w-full sm:hidden`}>
                      <span className={`flex bg-gradient-to-b from-zinc-500/20 via-zinc-500/80 to-zinc-600 justify-center items-center h-10`}
                        onClick={() => setReadingMore(!readingMore)}
                      >{readingMore ? '收 回' : '了解更多'}</span>
                    </div>
                  </div>
                )
              }
            </div>
          </div>
          <AddToCart itemID={itemID} itemDetails={data?.data}/>
          {(session.user !== 'signed out' && session.user !== false)
            ? (mutation.isLoading   //mutation.isLoading
              ? <button className={`my-8 flex justify-center font-bold -right-0 sm:right-[0%] md:right-20 bottom-[2.2rem] border-[2px] rounded-[0.275rem] border-red-500 tracking-wide active:border-red-800 py-[0.62rem] px-5 transition-colors bg-red-500 active:bg-red-600`}>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 left-[47%] top-[42%] text-white z-20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </button>
              : (session.user.favItems.includes(itemID)
                ? <button name='unlikeButton' id='unlikeButton' className={`my-8 font-bold -right-0 sm:right-[0%] md:right-20 bottom-[2.2rem] border-[2px] rounded-[0.275rem] border-red-500 tracking-wide active:border-red-800 py-2 px-5 transition-colors hover:bg-red-500 active:bg-red-600`}
                    onClick={(e) => {
                      mutation.mutate({
                        user: session.user,
                        item: data.data,
                        buttonId: e.target.id
                      })}}
                  >已加至我的最愛</button>
                : <button name='likeButton' id='likeButton' className={`my-8 font-bold -right-0 sm:right-[0%] md:right-20 bottom-[2.2rem] border-[2px] rounded-[0.275rem] border-red-500 tracking-wide active:border-red-800 py-2 px-5 transition-colors hover:bg-red-500 active:bg-red-600`}
                    onClick={(e) => {
                      mutation.mutate({
                        user: session.user,
                        item: data.data,
                        buttonId: e.target.id
                      })}}
                  >添加至我的最愛</button>
                )
              )
            : <div></div>
          }
          <div className='flex flex-col py-10'>
            <div className='text-2xl'>
              你可能會喜歡的
              <span className='pl-3'>{`${catDict[data?.data.itemType]}`}</span>
            </div>
              {data?.extra.length > 0 
                  ? 
                  <ul className='relative gap-12 min-[531px]:gap-4 py-6 grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(11.4rem,1fr))]'>
                    {data?.extra.map((item, index) => {
                      return (
                      <Recommendation key={index} item={item} catDict={catDict}/>
                      )
                    })}
                  </ul>
                :
                <div className='flex justify-center tracking-wider text-neutral-400 pt-28 pb-10 text-2xl'>更多精選產品即將登場!</div>
              }
          </div>
        </div>
      </div>
      <div className='0 lg:h-48'></div>
    </>
  )
}