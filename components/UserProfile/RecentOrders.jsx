import { useState, useEffect } from 'react';
import axios from "axios";
import { useQuery } from "react-query";
import { useAuthState } from "@/contexts/AuthContext";
import Image from "next/image";
import OrderItemDetailed from './OrderItemDetailed';

export default function RecentOrders({ closeAll }) {
  
  const [dropDownActive, setDropDownActive] = useState({});
  const MAX_NUM_OF_ORDER = 10;
  const LOCALE = 'zh-HK';   // to convert to locale time string
  const session = useAuthState();

  // reset all dropDowns
  useEffect(() => {
    setDropDownActive({});
  }, [closeAll]);
  
  const query = useQuery({
    queryKey: ['/api/protected/fetch/recentOrders', { id: session.user._id, maxOrder: MAX_NUM_OF_ORDER }],
    queryFn: async ({ queryKey }) => {
      const { data } = await axios.get(queryKey[0], { params: queryKey[1] });
      return data;
    },
    enabled: !!session.user._id
  })

  function handleClickDropDown(e) {
    if (dropDownActive[e.currentTarget.id] === undefined) {
      setDropDownActive({
        ...dropDownActive,
        [e.currentTarget.id]: true
      })
    } else {
      setDropDownActive({
        ...dropDownActive,
        [e.currentTarget.id]: !dropDownActive[e.currentTarget.id]
      })
    }
  }

  if (query.isLoading) {
    return (
      <div className='flex justify-center py-20 text-2xl text-zinc-400'>
        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    )
  }

  if (query.isFetched) {
    
    return (
      <>
        {query.data.data.length === 0 
          ? <div className='text-center py-20 text-2xl text-zinc-400'>
              下訂後即可於此查看訂單記錄
            </div>
          : query.data.data?.map((order) => {

              const date = new Date(order.timeOfSale);

              const year = date.getFullYear();
              const month = date.getMonth();
              const day = date.getDay();
              const time = date.toLocaleTimeString(LOCALE).replace(':', '時').replace(':', '分').slice(0, -2);
              const orderIDStr = order.orderID.toString();
              const orderIDStrReadable = `${orderIDStr.slice(0, 4)}-${orderIDStr.slice(4,10)}-${orderIDStr.slice(10, orderIDStr.length - 0)}`;

              // typeof order.orderID === Number
              // dropDownActive[orderIDStr]
              if (dropDownActive[orderIDStr]) {
                return (
                  <div id={order.orderID} key={order.orderID} className='border-2 border-transparent'>
                    <div className='relative bg-stone-700/40 flex items-center py-4 pl-3 sm:pl-5 sm:pr-2 h-full rounded-[0.25rem] '>
                      <div className='flex flex-col w-full px-2 py-1 sm:py-4 gap-1 sm:gap-3'>
                        <div className='flex flex-col sm:flex-row justify-between gap-1'>
                          <div className='flex gap-1'>
                            <span className='min-w-[2.5rem]'>日期:&nbsp;</span>
                            <div className='font-bold'>{year}</div>年
                            <div className='font-bold'>{month}</div>月
                            <div className='font-bold'>{day}</div>日
                            <button id={order.orderID} className="absolute right-8 sm:hidden px-5 py-5 rounded-full hover:bg-indigo-500/20 pointer-events-auto cursor-pointer" onClick={handleClickDropDown}>
                              <Image src='/dropdown-up-white.png' width={20} height={20} alt='Icon to open dropdown'/>
                            </button>
                          </div>
                          <div className='flex w-[65%] justify-start sm:flex-col sm:items-end relative'>
                            編號:&nbsp;
                            <span className='sm:absolute sm:top-7 sm:text-right sm:text-2xl font-bold sm:tracking-wider sm:min-w-[15rem] sm:w-[80%]'>{orderIDStrReadable}</span>
                          </div>
                        </div>
                        <div className='flex justify-start'>時間:&nbsp;
                          <span className="font-bold tracking-widest">{time}</span>
                        </div>
                        <div className='pt-5 flex flex-col gap-4 pl-2 pr-5'>
                          {order.itemID.map((item) => {
                            console.log(item);
                            return (
                              <OrderItemDetailed key={item.itemid} id={item.itemid} amount={item.amount} title={item.title} url={item.url} price={item.unitPrice}/>
                            )
                          })}
                        </div>
                        <div className='text-right text-2xl font-bold px-5 pt-4 pb-4'>
                        <span className=''>總付港幣</span>&nbsp; {order.total} 元
                        </div>
                      </div>
                      <button id={order.orderID} className="hidden sm:flex px-5 py-5 rounded-full hover:bg-indigo-500/20 pointer-events-auto cursor-pointer" onClick={handleClickDropDown}>
                        <Image src='/dropdown-up-white.png' width={20} height={20} alt='Icon to open dropdown'/>
                      </button>
                    </div>
                  </div>
                )
              } else {
                return (
                  <button id={order.orderID} key={order.orderID} className='border-2 border-transparent hover:border-white'
                    onClick={handleClickDropDown}
                  >
                    <div className='relative bg-stone-700/40 flex items-center py-4 pl-3 pr-4 sm:pl-5 sm:pr-2 h-fit rounded-[0.25rem] '>
                      <div className='flex flex-col gap-2 flex-1'>
                        <div className='flex'>
                          <span className='basis-12 shrink-0'>日期:</span>
                          <span className='flex gap-1'>
                            <span className='font-bold'>{year}</span>年
                            <span className='font-bold'>{month}</span>月
                            <span className='font-bold'>{day}</span>日
                            <span className="font-bold tracking-widest">{time}</span>
                          </span>
                        </div>
                        <div className='flex'>
                          <span className='basis-12 shrink-0'>商品:</span>
                          <div className='flex w-full gap-x-3 flex-wrap'>
                            {order.itemID.slice(0, 3).map((item, index) => {
                              return (
                                <div key={index} className='font-extrabold'>{item.title}</div>
                              )
                            })}
                            {order.itemID.length > 3 ? <span className="font-extrabold">...</span> : null}
                          </div>
                        </div>
                      </div>
                      <div className="hidden sm:flex px-5 py-5">
                        <Image src='/dropdown-down-white.png' width={20} height={20} alt='Icon to open dropdown'/>
                      </div>
                    </div>
                  </button>
                )
              }

            })
        }
        
      </>
    )
  }
}
