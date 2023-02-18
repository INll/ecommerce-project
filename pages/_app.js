import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';

// Component is default export of index.js
function MyApp({ 
  Component, 
  pageProps: { session, ...pageProps }, 
}) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <SessionProvider session={session}>
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  );
}

export default MyApp;