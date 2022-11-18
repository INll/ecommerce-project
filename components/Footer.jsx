import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <>
      <div className='w-full absolute bg-neutral-900'>
        <div className='mx-auto bg-neutral-900 sm:w-2/3 flex
         flex-col items-center'>
          <div className='pt-8 pb-2 flex justify-evenly gap-6 md:gap-14 lg:gap-20
            xl:gap-24'>
            <div className=''>推廣代碼</div>
            <Link href="https://github.com/INll">關於我們</Link>
            <div>工作機會</div>
            <div>用戸條款</div>
          </div>
          <a href="https://github.com/INll/ecommerce-project" className='pt-8 pb-10'>
            <img src="/github-logo-white.png" alt="github logo" className='h-12 
              transition-translate duration-150 hover:-translate-y-[0.15rem]'/>
          </a>
        </div>
      </div>
    </>
  )
}
