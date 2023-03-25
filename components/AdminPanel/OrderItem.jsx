import { useRouter } from 'next/router';

export default function OrderItem({ item, orderDetails, colSpan }) {
  const router = useRouter();

  // amount is stored in another array of objects
  let amountObj = orderDetails.find((element) => element.itemid === item._id);
  return (
    <>
      <li className='flex flex-col gap-1 sm:gap-0 sm:grid sm:grid-cols-12 sm:pr-3 md:pr-4 sm:justify-center sm:items-center border-2 border-transparent bg-stone-700/80 rounded-[0.275rem] w-[100%] text-center cursor-pointer
      hover:border-white'
        onClick={() => router.push(`/item/${item._id}`)}
      >
        {/* img tag determines height, negative margin compensates border-2 */}
        <img className={`h-28 w-full -my-[2px] object-contain sm:object-cover rounded-t-[0.275rem] sm:rounded-tr-none sm:rounded-l-[0.275rem] sm:ml-[2px] sm:col-span-3`} id={item._id} src={item.images.url} alt={`Image of ${item.title}`}/>
        <div className={`sm:col-span-5 sm:w-full px-[8%] pt-[6%] text-left sm:text-center sm:px-8 sm:pt-0`}>
          <div className='sm:hidden text-gray-300'><i><u>名稱</u></i></div>
          <div className='font-bold sm:font-normal mb-2 sm:mb-0'>{item.title}</div>
        </div>
        <div className={`sm:col-span-1 sm:w-full px-[8%] text-left sm:text-center sm:px-0 sm:pt-0`}>
          <div className='sm:hidden text-gray-300'><i><u>類別</u></i></div>
          <div className='font-bold sm:font-normal mb-2 sm:mb-0'>{item.itemType}</div>
        </div>
        <div className={`sm:col-span-2 sm:w-full px-[8%] text-left sm:text-center sm:px-0 sm:pt-0`}>
          <div className='sm:hidden text-gray-300'><i><u>價格</u></i></div>
          <div className='font-bold sm:font-normal mb-2 sm:mb-0'>{item.price}</div>
        </div>
        <div className={`sm:col-span-1 sm:w-full px-[8%] pb-[6%] sm:pb-0 text-left sm:text-center sm:px-0 sm:pt-0`}>
          <div className='sm:hidden text-gray-300'><i><u>數量</u></i></div>
          <div className='font-bold sm:font-normal mb-2 sm:mb-0'>{amountObj.amount}</div>
        </div>
      </li>
    </>
  )
}