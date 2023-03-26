import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import SideLink from './SideLink';
import { useAuthDispatch, useAuthState } from '@/contexts/AuthContext';
import * as Scroll from 'react-scroll';
import Image from 'next/image';
import RecentOrders from './RecentOrders';
import { useCartDispatch } from '@/contexts/CartContext';

let ScrollLink = Scroll.Link;
let Element = Scroll.Element;

function handleError (err, res) {
  console.log(`Error: ${err}`);
  console.log(err.stack);
}

export default function ProfilePage({ userName }) {

  const router = useRouter();
  const dispatch = useAuthDispatch();
  const session = useAuthState();

  const cartDispatch = useCartDispatch();

  // detect if an element is in view
  const [inView, setInView] = useState({
    zerothSecHeading: false,
    firstSecHeading: false
  });

  const [closeAll, setCloseAll] = useState(false);

  // for sidebar
  const pageSections = ['最近訂單'];  //'訂單查詢'
  const scrollToElementsIDs = ['zerothSection', 'firstSection'];
  const scrollConfigs = {
    smooth: true,
    duration: 300,
    offset: -150
  };

  const observe0thSec = useRef();
  const observe1stSec = useRef();
  let observerOptions = { rootMargin: '0px 0px -80% 0px', threshold: 0}

  const username = userName || session.user.userName;

  // track in view status of some elements to highlight them in aside nav
  useEffect(() => {
     // initialize
    setInView({
      ...inView,
      zerothSecHeading: true
    });
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView({
              zerothSecHeading: false,
              firstSecHeading: false,
              secondSecHeading: false,
              thirdSecHeading: false
            });
            setInView({
              ...inView,
              [entry.target.id]: true
            });
          }
        }
      )
    }, observerOptions);
    observer.observe(observe0thSec.current);
    observer.observe(observe1stSec.current);
  }, []);

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
      cartDispatch({
        type: 'clearedCart',
        payload: null
      });
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
      <div className='max-w-full lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl bg-neutral-800/80 lg:rounded-md xl:rounded-xl mx-auto sm:px-20 lg:px-20 xl:px-24 py-14 sm:py-[4.6rem]'>
        <div className="relative px-8 sm:px-0">
          <div className='w-[65%] sm:w-full font-extralight text-4xl lg:text-5xl xl:text-6xl pb-6'>歡迎回來, {username} !</div>
          <div className="overflow-hidden">
            <div className="h-[0.1rem] w-[150%] bg-gradient-to-r from-white via-neutral-800 to-neutral-800 mt-1"></div>
          </div>
          <button className='absolute font-bold right-8 sm:right-[0%] md:right-20 bottom-[2.2rem] border-[2px] rounded-[0.275rem] border-red-500 tracking-wide active:border-red-800 py-2 px-5 transition-colors hover:bg-red-500 active:bg-red-600
          '
            onClick={handleSignoutRequest}
          >登出<span className='invisible absolute sm:visible sm:relative'>帳號</span></button>
        </div>
        <div className="sm:grid sm:gap-11 sm:grid-cols-12 mt-14">
          <div className="max-height-fit sm:max-w-[98%] col-span-12 lg:col-span-9">
            <main className='flex flex-col gap-7'>
              <Element className="zerothSection">
                <section id="zerothSec" className='flex flex-col gap-4 mb-5'>
                  <h2 id='zerothSecHeading' ref={observe0thSec} className='px-8 sm:px-0 text-3xl sm:text-4xl lg:text-3xl xl:text-4xl tracking-wide mb-4 flex justify-between'>
                    <div>{pageSections[0]}</div>
                    <button className='text-xl mr-4 hover:border-indigo-300 hover:font-bold py-1 px-2 rounded-[0.25rem] hover:bg-indigo-500/20 relative' onClick={() => setCloseAll(!closeAll)}>關閉全部</button>
                  </h2>
                  <RecentOrders closeAll={closeAll}/>
                </section>
              </Element>
              <Element name="firstSection">
                <section id="firstSec" className='flex flex-col gap-4'>
                  <h2 id='firstSecHeading' ref={observe1stSec} className='text-3xl sm:text-4xl lg:text-3xl xl:text-4xl tracking-wide mb-4'>{pageSections[1]}</h2>
                  {/* margin-left: auto gives left margin a share (in this case, **all**) of the remaining space */}
                </section>
              </Element>
            </main>
          </div>
          <aside className='absolute invisible mt-6 lg:visible lg:static col-span-3'>
            {/* Why: https://stackoverflow.com/a/43707215/17974101 */}
            <nav className='sticky h-fit top-44'>
              <div className="flex-col">
                <section>
                  <header className='pb-[0.8rem] text-2xl font-extrabold tracking-widest'>快速導航</header>
                  <ul>
                    {pageSections.map((section, index) => {
                      return (
                        <SideLink key={index} to={scrollToElementsIDs[index]} config={scrollConfigs} text={pageSections[index]} inview={Object.values(inView)[index]}/>
                      )
                    })}
                  </ul>
                </section>
              </div>
            </nav>
          </aside>
        </div>
      </div>
      <div className='0 lg:h-48'></div>
    </>
  )
}