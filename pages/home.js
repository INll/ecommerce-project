import HomePage from '@/components/Main/HomePage';
import Layout from '@/components/Main/Layout';

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