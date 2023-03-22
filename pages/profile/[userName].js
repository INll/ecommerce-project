import * as React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ProfilePage from '../../components/UserProfile';
import useCartDispatch from '../../contexts/AnimationContext';

export default function Profile() {
  const router = useRouter();
  const { userName } = router.query;

  return (
    <>
      <ProfilePage userName={userName}/>
    </>
  )
}

// <Layout> defines what layout to use with this page
Profile.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}