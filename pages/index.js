import * as React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { Product, Hero, Navbar, HeroBanner, FooterBanner, Footer, HomePage, Cart } from '../components';
import Layout from '../components/Layout';


export default function Home() {
  // const [component, setComponent] = React.useState(<HomePage />);

  // // Make sure window object is the same
  // React.useEffect(() => {
  //   console.log(window.location.pathname);
  //   switch (window.location.pathname) {
  //     case "/":
  //       setComponent(<HomePage />);
  //       break;
  //     case "/cart":
  //       setComponent(<Cart />);
  //       break;
  //     case "/about":
  //       setComponent(<About />);
  //       break;
  //   }  
  // }, [])

  // TODO: Relocate Cart, About, etc from /components to /pages because
  // that's how routing works

  return (
    <>
      <HomePage />
    </>
  )
}

// Wrap page content with a Layout component
Home.getLayout = function getLayout(page) {
  console.log(Layout);
  return (
    <Layout>
      {page}
    </Layout>
  )
}