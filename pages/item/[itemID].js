import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ItemPage from '../../components/Item';
import { createContext, useContext } from 'react';
import { motion } from "framer-motion";

export default function Profile() {

  const router = useRouter();
  const { itemID } = router.query;

  const AnimationContext = createContext(null);

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