import React from 'react';

export default function UserDetails({ userDetails }) {
  return ( 
    <>
      <div className='flex flex-col sm:flex-row w-full max-w-full sm:max-w-full sm:w-auto'>
        <div className='flex flex-col grow'>
          <span className='flex justify-between text-lg'>用戶名稱: <b className='text-right text-base sm:text-lg'>{userDetails.userName}</b></span>
          <span className='flex justify-between text-lg'>注冊時間: <b className='text-right text-base sm:text-lg'>{`${userDetails.creationTime.slice(0, 10)} ${userDetails.creationTime.slice(11, 19)}`}</b></span>
          <span className='flex justify-between text-lg'>最後上線: <b className='text-right text-base sm:text-lg'>{`${userDetails.lastLogin.slice(0, 10)} ${userDetails.lastLogin.slice(11, 19)}`}</b></span>
        </div>
        <div className='grow-[2]'></div>
        <div className="flex flex-col">
          <div className='sm:text-right text-lg'>權限: <p className='font-bold text-2xl text-right'>{userDetails.clearance}</p></div>
        </div>
      </div>
    </>
  )
}
