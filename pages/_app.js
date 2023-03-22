import '../styles/globals.css';
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { AuthProvider } from '../contexts/index';
import { CartProvider } from '../contexts/cartContext';
import { AnimationProvider } from '../contexts/AnimationContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    }
  }
});


function MyApp({ Component, pageProps }) {
  // 
  useEffect(() => {
    // TODO: Loal from localStorage for cart data
  }, []);

  const getLayout = Component.getLayout || ((page) => page);
  return (
    <AnimationProvider>
      <CartProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {getLayout(<Component {...pageProps} />)}
            <ReactQueryDevtools initialIsOpen={false} />
          </AuthProvider>
        </QueryClientProvider>
      </CartProvider>
    </AnimationProvider>
  );
}

export default MyApp;