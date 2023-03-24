import { useQuery } from 'react-query';
import { useSortContext } from './SortContext';
import { useAuthDispatch, useAuthState } from "../../contexts";
import ShopItem from './ShopItem';
import Image from 'next/image';
import catBg from '../../public/ms-logo-white.png';
import axios from 'axios';
import Skeleton from './Skeleton';

export default function ItemGrid() {
  
  const sortContext = useSortContext();
  const dispatch = useAuthDispatch();
  const ITEM_FETCH_MAX_AMOUNT = 20;

  const fetchItemQueryFn = async ({ queryKey }) => {
    try {
      const { data } = await axios.get(queryKey[0], { params: queryKey[1] });
      // query returns fav list in addition to item info
      if (data.result === 2) {
        dispatch({
          type: 'updateFav',
          payload: {
            user: data.user,
            errMessage: null
          }
        });
      }
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

  const { data, isLoading, isError } = useQuery({  // fires query when queryKeys change
    queryKey: ['/api/public/fetch/catalogue', { limit: ITEM_FETCH_MAX_AMOUNT, sort: sortContext.sort }],
    queryFn: fetchItemQueryFn 
    }
  )

  if (isLoading) {
    return (    
      <>
        {/* the 531px breakpoint corresponds to the 12rem in minmax */}
        <div className="unset bg-neutral-900 px-12 sm:px-14 md:px-[12%] pb-16">
          <div className="sticky top-[40%] sm:top-[10%] opacity-[0.15] flex justify-center">
            <Image src={catBg} alt='background image using logo of MANSWHERE' quality={100} className='absolute'/>
          </div>
          <div className='relative gap-12 min-[531px]:gap-4 py-6 grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(11.4rem,1fr))]'>
            <Skeleton />
          </div>
        </div>
      </>
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
      {/* the 531px breakpoint corresponds to the 12rem in minmax */}
      <div className="unset bg-neutral-900 px-12 sm:px-14 md:px-[12%] pb-16">
        <div className="sticky top-[40%] sm:top-[10%] opacity-[0.15] flex justify-center">
          <Image src={catBg} alt='background image using logo of MANSWHERE' quality={100} className='absolute'/>
        </div>
        <ul className='relative gap-12 min-[531px]:gap-4 py-6 grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(11.4rem,1fr))]'>
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


