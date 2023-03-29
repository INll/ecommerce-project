import { useRouter } from 'next/router';
import { useEffect } from 'react';
import HomePage from '@/components/Main/HomePage';
import Layout from '@/components/Main/Layout';

export default function Index() {
  // const router = useRouter();

  // useEffect(() => {
  //   if (location.pathname === '/') router.push('/home');
  //   else router.push(location.pathname);
  // })

  return (
    <>
      <HomePage />
    </>
    // <>
    //   <div className='text-3xl flex justify-center pt-[40vh]'>
    //     Loading
    //     <span>.</span>
    //     <span>.</span>
    //     <span>.</span>
    //   </div>
    // </>
  )
}

Index.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}