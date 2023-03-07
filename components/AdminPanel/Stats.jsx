import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Stats() {
  const [ stats, setStats ] = useState({
    signupsPrev: null,
    signupsCurr: null,
    mau: null,
    ame: null 
  })
  const [ loading, setLoading ] = useState(true);

  async function fetchData() {
    try {
      const response = await axios.get('/api/admin/fetch/dashboard');
      // console.log(response.data.message);
      setStats({
        ...stats,
        signupsPrev: response.data.message[0],
        signupsCurr: response.data.message[1],
        mau: response.data.message[2],
        ame: response.data.message[3]
      })
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    // fetchData();
  }, []);
  
  return (
    <div className='bg-stone-700/20 h-40 rounded-[0.25rem]'>
      <section className='grid grid-cols-3 h-full gap-1 pr-4'>
        <div className='flex flex-col content-center items-center'>
          <div className='col-span-1 flex items-end h-10 text-xl tracking-wider basis-2/5 relative'>
            本月注冊
            <div className='text-gray-400/60 text-sm w-[200%] tracking-tight absolute left-[5.5rem]'>{'(相比上月)'}</div>
          </div>
          <div className='basis-4/5 w-full pb-2 flex justify-center items-center h-full'>
            {loading
              ? <div className='text-[2.5rem] font-medium relative'></div>
              : <div className='text-[2.5rem] font-medium relative'>{stats.signupsCurr}
                  <div className={`absolute text-2xl font-normal -right-8 bottom-2 ${(stats.signupsPrev > stats.signupsCurr) 
                    ? 'text-rose-600 before:content-["-"]' 
                    : 'text-green-400 before:content-["+"]'
                    }`}>{stats.signupsPrev}</div>
                </div>
            }
          </div>
        </div>
        <div className='flex flex-col content-center items-center relative'>
          <div className='col-span-1 flex items-end h-10 text-xl tracking-wider basis-2/5'>
          30天活躍用戶
          </div>
          <div className='basis-4/5 w-full pb-2 flex justify-center items-center h-full'>
          {/* spinner taken from https://tailwindcss.com/docs/animation#spin */}
          {loading 
            ? <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            : <div className='basis-4/5 w-full flex justify-center items-center h-full'>
                <div className='text-[2.5rem] font-medium relative'>{stats.mau}</div>
              </div>
          }
          </div>
        </div>
        <div className='flex flex-col content-center items-center relative'>
          <div className='col-span-1 flex items-end h-10 text-xl tracking-wider basis-2/5'>
          人均每月消費
          </div>
            {loading 
              ? <div className='basis-4/5 w-full pb-2 flex justify-center items-center h-full'></div>
              : <div className='basis-4/5 w-full pb-2 flex justify-center items-center h-full'>
                  <div className='text-[2rem] font-medium relative'>{stats.ame}
                </div>
              </div>
            }
        </div>
      </section>
    </div>
  )
};