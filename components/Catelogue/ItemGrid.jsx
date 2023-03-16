import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import { useSortContext } from './SortContext';
import ShopItem from './ShopItem';

import axios from 'axios';

export default function ItemGrid() {
  const sortContext = useSortContext();

  const fetchItemQueryFn = async ({ queryKey }) => {
    try {
      const { data } = await axios.get(queryKey[0], { params: queryKey[1] });
      return data;
    } catch (err) {
      console.log(err.stack);
      throw new Error(err);
    }
  }

  const catDict = { 
    'shoes': '鞋',
    'accessories': '飾品',
    'bottoms': '下裝',
    'hats': '帽',
    'outers': '外套'
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['/api/public/fetch/catelogue', { limit: 15, sort: sortContext.sort }],
    queryFn: fetchItemQueryFn 
    }
  )

  if (isLoading) {
    return (
      <div className='bg-neutral-900 px-12 sm:px-14 h-[100rem] md:px-[12%]'>
        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  };

  if (isError) {
    return (
      <div className='bg-neutral-900 px-12 sm:px-14 md:px-[12%]'>
        (JSON.stringify(fetchQuery.error))
      </div>
    );
  };
  
  return (
    <>
      <div className='bg-neutral-900 px-12 sm:px-14 md:px-[12%] pb-4'>
        <ul className='gap-4 py-6 grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]'>
          {data.data?.map((item) => {
            return (
              <ShopItem key={item._id} item={item} catDict={catDict}/>
            )
          })}
        </ul>
      </div>
    </>
  )
}