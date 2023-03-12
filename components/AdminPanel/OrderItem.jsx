import { useEffect } from 'react';

export default function OrderItem({ item }) {

  return (
    <>
      <li key={item._id} className='border-2 border-transparent grid grid-cols-12 pr-4 justify-center items-center bg-stone-700/80 rounded-[0.275rem] w-[100%] text-center cursor-pointer
      hover:border-white'>
        {/* img tag determines height, negative margin compensates border-2 */}
        <img className='col-span-3 h-28 w-full -my-[2px] -ml-[2px] object-cover rounded-l-[0.275rem]' id={item._id} src={item.images.url} alt={`Image of ${item.title}`}/>
        <div className='col-span-4'>{item.title}</div>
        <div className='col-span-1'>{item.itemType}</div>
        <div className='col-span-2'>{item.price}</div>
        {/* <div>{item.description}</div> */}
        <div className='col-span-2'>{item.stock}</div>
      </li>
    </>
  )
}