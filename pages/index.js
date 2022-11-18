import * as React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { Product, Hero, Navbar, Layout, HeroBanner, FooterBanner, Footer, HomePage, Cart } from '../components';


export default function Home() {
  const [component, setComponent] = React.useState(<HomePage />);

  React.useEffect(() => {
    switch (window.location.pathname) {
      case "/":
        setComponent(<HomePage />);
        break;
      case "/cart":
        setComponent(<Cart />);
        break;
      case "/about":
        setComponent(<About />);
        break;
    }  
  }, [])


  return (
    <>
      <Navbar />
      {component}
    </>
  )
}
