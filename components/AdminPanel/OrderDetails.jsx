import React from 'react';

export default function OrderDetails({ orderDetails, user }) {
  return ( 
    <div className='flex mt-8'>
      <div className='flex flex-col grow'>
        <span className='flex justify-between text-lg'>收件用戶: <b>{user.userName}</b></span>
        <span className='flex justify-between text-lg'>日期: <b>{orderDetails.timeOfSale.slice(0, 10)}</b></span>
        <span className='flex justify-between text-lg'>時間: <b>{orderDetails.timeOfSale.slice(11, 19)}</b></span>
      </div>
      <div className='grow-[2]'></div>
      <div className='text-right'>編號: <p className='font-bold text-2xl'>{orderDetails.orderID}</p></div>
    </div>
  )
}
