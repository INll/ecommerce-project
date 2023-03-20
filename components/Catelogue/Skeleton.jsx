import React from 'react'

const skeleton = [1, 2, 3, 4, 5];

export default function Skeleton() {
  return (
    <>
      {skeleton.map((item, index) => {
        return (
          <li className='animate-pulse flex flex-col w-full sm:w-fit h-[30rem] sm:h-[27rem] md:h-[25rem] bg-stone-700/20 rounded-[0.375rem] backdrop-blur-sm sm:backdrop-blur-md cursor-pointer'>
            <div className="flex flex-col justify-between md:overflow-hidden px-5 pt-3 h-full">
                <img src='/skeleton-item-image.png' alt={`loading`}
                className='invisible rounded-lg bg-zinc-800 w-full h-auto sm:w-[40%] sm:mt-4'
              />
            </div>  
          </li>
        )
      })}
    </>
  )
}
