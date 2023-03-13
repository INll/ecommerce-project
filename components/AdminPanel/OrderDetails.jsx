import React from 'react';

export default function OrderDetails({ orderDetails, user }) {
  return ( 
    <div className='flex flex-col sm:flex-row mt-8 w-full max-w-full sm:max-w-full sm:w-auto'>
      <div className='flex flex-col grow'>
        <span className='flex justify-between text-lg'>收件用戶: <b>{user.userName}</b></span>
        <span className='flex justify-between text-lg'>日期: <b>{orderDetails.timeOfSale.slice(0, 10)}</b></span>
        <span className='flex justify-between text-lg'>時間: <b>{orderDetails.timeOfSale.slice(11, 19)}</b></span>
      </div>
      <div className='grow-[2]'></div>
      <div className='sm:text-right'>編號: <p className='font-bold text-xl sm:text-2xl text-left'>{orderDetails.orderID}</p></div>
    </div>
  )
}
