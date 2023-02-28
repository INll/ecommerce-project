import '../styles/globals.css';
import { AuthProvider } from '../contexts/index';

// Component is default export of index.js
function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <AuthProvider>
      {getLayout(<Component {...pageProps} />)}
    </AuthProvider>
  );
}

export default MyApp;