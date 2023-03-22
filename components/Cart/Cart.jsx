import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuthDispatch, useAuthState } from '../../contexts';
import { useQuery } from 'react-query';
import * as Scroll from 'react-scroll';
import Image from 'next/image';
import Link from 'next/link';
import { useCartState, useCartDispatch } from '../../contexts/cartContext';
import { useAnimationState, useAnimationDispatch } from '../../contexts/AnimationContext';
import CartContent from './CartContent';
import Price from './Price';
import Pay from './Pay'

let ScrollLink = Scroll.Link;
let Element = Scroll.Element;

function handleError (err, res) {
  console.log(`Error: ${err}`);
  console.log(err.stack);
}

export default function ItemPage({ prop }) {

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

  // sample API call
  async function handleSignoutRequest() {
    try {
      const response = await axios.get('/api/signout');
      if (response.status === 200) {
        localStorage.clear();
        dispatch({
          type: 'logout',
          payload: {
            user: false,
            errMessage: 'successful log out'
          }
        });
        router.push('/');
      }
      console.log('successfully logged out');
    } catch (err) {
      handleError(err);
    }
  }

  return (
    <>
      {/* breakpoints: sm lg xl */}
      <div className=" h-[100vh] w-[100vw] -z-10 fixed">
        <Image alt='background image' priority={true} src="/dashboard-background.png" quality={100}
          fill={true} sizes="100vw" className='object-fill absolute'
        />
      </div>
      <div className='h-0 lg:h-32'></div>
      <div className='max-w-full lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl bg-neutral-800/80 lg:rounded-md xl:rounded-xl mx-auto px-0 sm:px-0 lg:px-10 xl:px-24 py-14 sm:py-[4.6rem]'>
        <div className='flex flex-col justify-center items-center'>
          <p className='text-4xl tracking-widest'>購物車</p>
          <CartContent />
          {(session.user !== 'signed out' && session.user !== false )
            ? (cart.length > 0) 
              ? ( <>
                    <Price />
                    <Pay />
                  </>
                )
              : <Link href='/'>
                  <div className='text-xl'><i><u>前住首頁瀏覽商品</u></i></div>
                </Link>
            : null
          }
        </div>
      </div>
      <div className='0 lg:h-48'></div>
    </>
  )
}