import React from 'react';
import { Menu } from '@headlessui/react';
import { useSortDispatch } from './SortContext';

export default function SortOptions({ sort }) {

  const dispatch = useSortDispatch();

  return (
    <Menu.Item as='ul' className=''>
      {({ active }) => (
        <button
          className={`${active
            ? 'text-white'
            : 'text-zinc-50 sm:text-zinc-300'} group text-left w-full rounded-[0.275rem] text-2xl backdrop-blur-lg mt-2 px-4`
          }
          onClick={async () => {
            dispatch({
              type: 'changeSort',
              sorting: sort
            });
          }}
        >{sort}
        </button>
      )}
    </Menu.Item>
  )
}