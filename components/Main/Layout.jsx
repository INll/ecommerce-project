import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Main/Footer';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}