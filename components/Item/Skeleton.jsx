import Image from 'next/image';

export default function Skeleton() {

  const skeleton = [1, 2, 3, 4, 5];

  return (
    <>
      {/* breakpoints: sm lg xl */}
      <div className="h-[100vh] w-[100vw] -z-10 fixed">
        <Image alt='background image' priority={true} src="/dashboard-background.png" quality={100}
          fill={true} sizes="100vw" className='object-fill absolute'
        />
      </div>
      <div className='h-0 lg:h-32'></div>
      <div className='max-w-full lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl bg-neutral-800/80 lg:rounded-md xl:rounded-xl mx-auto px-8 sm:px-12 md:px-20 lg:px-20 xl:px-24 pt-8 pb-14 sm:py-[4.6rem]'>
        <div className='flex flex-col'>
          <div className='flex flex-col items-center gap-10 sm:flex-row sm:gap-10 sm:items-start'>
            <div className='h-auto sm:h-60 md:h-72 bg-zinc-700 rounded-2xl animate-pulse'>
              <img src='/skeleton-item-image.png' alt={`loading`}
                className='invisible rounded-lg bg-zinc-800 w-full h-auto sm:w-[40%] sm:mt-4'
              />
            </div>
            <div className='flex flex-col gap-10 w-full'>
              <div className='py-3 tracking-wider text-2xl w-full bg-zinc-700 animate-pulse h-9 rounded-full'>&nbsp;</div>
              <div className='w-full flex justify-end'>
                <div className='px-3 w-[50%] h-9 rounded-full bg-zinc-600 animate-pulse'>&nbsp;</div>
              </div>
            </div>
          </div>
          <div className='flex flex-col py-10'>
            <div className='h-9 my-10 w-[40%] bg-zinc-600 rounded-full animate-pulse'>&nbsp;</div>
            <ul className='relative gap-12 min-[531px]:gap-4 py-6 grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(11.4rem,1fr))]'>
              {skeleton.map((item, index) => {
                return (
                  <li key={index} className='flex flex-col w-full sm:w-fit h-[20rem] sm:h-[27rem] md:h-[25rem] bg-zinc-700 animate-pulse rounded-[0.375rem] backdrop-blur-sm sm:backdrop-blur-md cursor-pointer'>
                    <div  className="h-40 object-contain sm:h-fit"><img src='/skeleton-item-image.png' className='invisible'/></div>
                    <div className="flex flex-col justify-between md:overflow-hidden px-5 pt-3 h-full">
                      <div>
                        <div className="text-2xl h-fit sm:text-xl"></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex justify-end py-4 sm:pb-4 items-end text-4xl font-bold"></div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
      <div className='0 lg:h-48'></div>
    </>
  )
}
