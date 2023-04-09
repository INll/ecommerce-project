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
        {item.images
          ? <img className={`h-28 w-full -my-[2px] object-contain sm:object-cover rounded-t-[0.275rem] sm:rounded-tr-none sm:rounded-l-[0.275rem] sm:ml-[2px] sm:col-span-3`} id={item._id} src={item.images.url} alt={`Image of ${item.title}`}/>
          : <div className='h-28 w-full'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
            </div>
        }
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