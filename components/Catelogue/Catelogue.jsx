import { Menu } from '@headlessui/react';
import ItemGrid from './ItemGrid';
import SortOptions from './SortOptions';
import { SortProvider } from './SortContext';
import { ViewProvider } from './ViewContext';
import CatSelector from './CatSelector';
import SortMenuButton from './SortMenuButton';
import * as Scroll from 'react-scroll';

const sorts = ['默認', '種類', '價格(高至低)', '價格(低至高)'];
const categories = ['帽', '外套', '鞋', '飾品', '下裝'];

export default function Catelogue() {
  let Element = Scroll.Element;
  
  return (
    <>
      <ViewProvider>
        <SortProvider>
          <Element name="catelogue">
            <ul className='bar w-full h-full flex justify-between px-7 sm:px-14 md:px-[12%] py-7 bg-neutral-900'>
              <li className='title font-bold text-4xl'><span className='hidden md:inline'>熱賣</span>商品</li>
              <li className='flex text-zinc-500 items-end font-bold text-xl sm:text-2xl gap-8'>只看
                <ul className='flex '>
                  {categories.map((cat, index) => {
                    return <CatSelector key={index} cat={cat} />
                  })}
                </ul>
              </li>
              <li className='relative flex items-end gap-5 font-bold text-xl sm:text-2xl'>
                <Menu as="div" className='inline-block sm:right-0 z-10'>
                  <SortMenuButton />
                  <Menu.Items className='absolute border-2 border-transparent w-44 top-9 right-0 sm:-right-[19%] rounded-[0.275rem]'>
                    <div className="backdrop-blur-md pb-3">
                      {sorts.map((sort, index) => {
                        return <SortOptions key={index} sort={sort} />
                      })}
                    </div>
                  </Menu.Items>
                </Menu>
                <span className='text-zinc-500'>排列</span>
              </li>
            </ul>
          </Element>
          <div className="overflow-hidden px-7 sm:px-14 md:px-[12%] py-4 bg-neutral-900">
            <div className="relative h-[0.1rem] w-[120%] bg-gradient-to-r from-white via-neutral-900 to-neutral-900"></div>
          </div>
          <ItemGrid />
        </SortProvider>
      </ViewProvider>
    </>
  )
}
