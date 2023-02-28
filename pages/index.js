import * as React from 'react';
import { HomePage } from '../components';
import Layout from '../components/Layout';


export default function Home() {
  return (
    <>
      <HomePage />
    </>
  )
}

// <Layout> defines what layout to use with this page
Home.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}