import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuthDispatch, useAuthState } from '../../contexts';
import { useMutation } from 'react-query';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartState, useCartDispatch } from '../../contexts/cartContext';
import { useAnimationState, useAnimationDispatch } from '../../contexts/AnimationContext';
import CartContent from './CartContent';
import Price from './Price';
import Pay from './Pay'

function handleError (err, res) {
  console.log(`Error: ${err}`);
  console.log(err.stack);
}

export default function ItemPage({ prop }) {

  const [orderId, setOrderId] = useState('');
  const [err, setErr] = useState({
    errMsg: null,
    details: null
  });

  // map to response result code
  const errorMessages = [
    '發生未知錯誤, 請再試一次',
    '',
    '訂單發生錯誤, 請聯繫管理員',
    '數量發生錯誤, 請聯繫管理員',
    '以下商品庫存不足, 已自動修正訂購數目, 請再試一次, 或聯繫管理員以取得支援: ',
    '發生未知錯誤, 請再試一次'
  ]

  // read session
  const router = useRouter();
  const dispatch = useAuthDispatch();
  const session = useAuthState();

  // read cart
  const cart = useCartState();
  const cartDispatch = useCartDispatch();

  // read animation context
  const animationState = useAnimationState();
  const animationDispatch = useAnimationDispatch();

  // submit order
  const mutation = useMutation(async (cart) => {
    return await axios.post('/api/protected/post/order/create', [ cart, session.user ])
  }
  , { onSuccess: (res) => {
    console.log(res);
    switch (res.data.result) {
      case 0:
        setErr({ errMsg: errorMessages[0], details: null });
        throw new Error(errorMessages[0]);
      case 1:
        setOrderId(res.data.orderID);
        cartDispatch({ type: 'clearedCart', payload: null });
        break;
      case 2:
        setErr({ errMsg: errorMessages[2], details: null });
        throw new Error(errorMessages[2]);
      case 3:
        setErr({ errMsg: errorMessages[3], details: null });
        throw new Error(errorMessages[3]);
      case 4:
        for (let i = 0; i < res.data.details.length; i++ ) {
          cartDispatch({ type: 'changedToQty', payload: { id: res.data.details[i].id, newQty: res.data.details[i].stock }});
        }
        cartDispatch({ type: 'savedToLocalStorage', payload: null });
        setErr({ errMsg: errorMessages[4], details: res.data.details });
        throw new Error(errorMessages[4])
      default:
        setErr({ errMsg: errorMessages[errorMessages.length - 1], details: null });
        throw new Error(errorMessages[errorMessages.length - 1]);
    }
  }, onError: (err) => {
    console.log(err.message);
  }})

  return (
    <>
      {/* breakpoints: sm lg xl */}
      <div className=" h-[100vh] w-[100vw] -z-10 fixed">
        <Image alt='background image' priority={true} src="/dashboard-background.png" quality={100}
          fill={true} sizes="100vw" className='object-fill absolute'
        />
      </div>
      <div className='h-0 lg:h-32'></div>
      <div className='min-h-[65vh] h-fit lg:h-[90%] max-w-full lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl bg-neutral-800/80 lg:rounded-md xl:rounded-xl mx-auto px-0 sm:px-0 lg:px-10 xl:px-24 py-14 sm:py-[4.6rem]'>
        <div className='flex flex-col items-center h-full'>
          <p className='text-4xl tracking-widest'>
            {mutation.isSuccess 
              ? '下訂成功!'
              : mutation.isError
                  ? '訂單錯誤'
                  : '購物車'
            }
          </p>
          {mutation.isSuccess
            ? <div className='flex flex-col justify-center items-center py-10 text-2xl h-[80%]'>
                <div className=''>訂單編號: </div>
                <div className='py-16 tracking-wider text-3xl sm:text-5xl font-bold'>
                  1234-567890-1234
                </div>
                <div className='px-10 text-center text-xl sm:text-3xl'>
                  前往 <Link href={`/profile/${session.user.userName}`}><i><u>個人主頁</u></i></Link> 以查看訂單, 或返回 <Link href='/'><i><u>首頁</u></i></Link> 以瀏覽更多商品
                </div>
              </div>
            : (mutation.isError 
                ? <div className='flex flex-col justify-center items-center py-10 text-2xl h-[80%]'>
                    <div className='px-[10%] text-center text-base sm:text-2xl py-10 text-zinc-200'>{err.errMsg}</div>
                    <div>
                      {err.details.map((item) => {
                        return (
                          <span className='font-bold'>{item.title}</span>
                        )
                      })}
                    </div>
                    <button onClick={() => mutation.reset()} className='px-[10%] text-center text-xl sm:text-2xl my-16 text-zinc-200'>
                      <u>返回購物車</u></button>
                  </div>
                : <>
                    <CartContent />
                      {(session.user !== 'signed out' && session.user !== false )
                        ? (cart.length > 0) 
                          ? ( <>
                                <Price />
                                <Pay mutation={mutation}/>
                              </>
                            )
                          : <Link href='/'>
                              <div className='text-xl'><i><u>前住首頁瀏覽商品</u></i></div>
                            </Link>
                        : null
                      }
                  </>
              )
          }
        </div>
      </div>
      <div className='0 lg:h-48'></div>
    </>
  )
}