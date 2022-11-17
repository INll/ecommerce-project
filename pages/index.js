import * as React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { Product, Hero, Navbar, Layout, HeroBanner, FooterBanner, Footer, Cart } from '../components';


export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Layout />
    </>
  )
}
