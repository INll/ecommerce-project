import { useRouter } from 'next/router';
import Layout from '@/components/Main/Layout';
import ItemPage from '@/components/ShopItem/ItemPage';

export default function Profile() {

  const router = useRouter();
  const { itemID } = router.query;

    return (
    <>
      <ItemPage itemID={itemID}/>
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