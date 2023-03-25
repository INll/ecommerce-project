import React from 'react';

export default function OrderDetails({ orderDetails, user }) {

  const LOCALE = 'zh-HK';   // to convert to locale time string
  
  let date = new Date(orderDetails.timeOfSale);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDay();
  const time = date.toLocaleTimeString(LOCALE).replace(':', '時').replace(':', '分').slice(0, -2);

  return ( 
    <div className='flex flex-col sm:flex-row mt-8 w-full max-w-full sm:max-w-full sm:w-auto'>
      <div className='flex flex-col grow'>
        <span className='flex justify-between text-lg'>收件用戶: <b>{user.userName}</b></span>
        <span className='flex justify-between text-lg'>日期: 
          <div className='flex'>
            <div className='font-bold'>{year}</div>年
            <div className='font-bold'>{month}</div>月
            <div className='font-bold'>{day}</div>日
          </div>
        </span>
        <span className='flex justify-between text-lg'>時間: <b>{time}</b></span>
      </div>
      <div className='grow-[2]'></div>
      <div className='sm:text-right'>編號: <p className='font-bold text-xl sm:text-2xl text-left'>{orderDetails.orderID}</p></div>
    </div>
  )
}
