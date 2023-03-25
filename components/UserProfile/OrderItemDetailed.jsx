import { useRouter } from 'next/router';

export default function OrderItemDetailed({ id, amount, title, url, price }) {
  const router = useRouter();

  function handleDirectToItem(e) {
    if (e.target.className.includes('directToItem')) {
      router.push(`/item/${id}`);
    };
  };

  // amount is stored in another array of objects
  return (
    <>
      <div className='grid grid-cols-12 sm:pr-3 md:pr-4 sm:justify-center border-2 border-transparent bg-stone-700/80 rounded-[0.275rem] w-[100%] text-center'
      >
        {/* img tag determines height, negative margin compensates border-2 */}
        <div className='directToItem col-span-3 w-full flex sm:justify-center'
          onClick={handleDirectToItem}
        >
          <img className={`directToItem h-28 -my-[2px] object-cover rounded-t-[0.275rem] sm:rounded-tr-none sm:rounded-l-[0.275rem] sm:ml-[2px] cursor-pointer`} id={id} src={url} alt={`Image of ${title}`}
            onClick={handleDirectToItem}
          />
        </div>
        <div className='directToItem flex flex-col relative justify-center col-span-5 cursor-pointer' onClick={handleDirectToItem}>
          <div className='directToItem px-4 hover:font-bold hover:underline'>{title}</div>
          <div className='directToItem text-xl font-bold'><span className='text-sm text-zinc-400'>單價&nbsp;&nbsp;</span>{price}</div>
        </div>
        <div className='col-span-1 flex flex-col justify-center'>
          <div className='h-fit w-full flex flex-col items-center justify-center sm:h-auto'>
            <div className='h-full w-full sm:flex sm:items-center sm:justify-center font-bold text-xl'>{amount}</div>
          </div>
        </div>
        <button className='flex flex-col cursor-text items-center justify-center col-span-3 pb-1'>
          <div className='text-base text-zinc-400'>單項合共</div>
          <div className='text-xl font-bold'><span className='hidden sm:inline'>港幣</span><span className='relative sm:hidden text-sm pr-1'>$</span>{price * amount}</div>
          {/* <span className={`tracking-wider`}><span className='absolute top-[20%] text-sm text-zinc-400'>合計港幣</span><span className={`text-xl font-bold tracking-wider`}>{price * amount}</span>元</span> */}
        </button>
      </div>
    </>
  )
}
