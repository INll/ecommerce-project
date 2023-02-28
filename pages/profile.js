import * as React from 'react';
import ProfilePage from '../components/ProfilePage';
import Layout from '../components/Layout';

export default function Profile() {
  return (
    <>
      <ProfilePage />
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