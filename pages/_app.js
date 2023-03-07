import '../styles/globals.css';
import { AuthProvider, DashboardProvider } from '../contexts/index';

// Component is default export of index.js
function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <DashboardProvider>
      <AuthProvider>
        {getLayout(<Component {...pageProps} />)}
      </AuthProvider>
    </DashboardProvider>
  );
}

export default MyApp;