import * as React from 'react';
import AdminProfilePage from '@/components/AdminPanel/AdminPanel/';
import Layout from '@/components/Main/Layout';

export default function Profile() {
  return (
    <>
      <AdminProfilePage />
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