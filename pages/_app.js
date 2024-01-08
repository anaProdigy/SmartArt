import '@/styles/globals.css'
import '../styles/tailwind.css'
import { useEffect, useState } from 'react';

import { SearchState } from 'utils/search';
import { WishlistProvider } from 'utils/wishlistContext';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/Layout';

export default function App({ Component, pageProps }) {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  useEffect(() => {
    const updateWindowDimensions = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };

    updateWindowDimensions();

    // Listen to window resize events
    window.addEventListener('resize', updateWindowDimensions);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener('resize', updateWindowDimensions);
    };
  }, []);

  return (
    <SearchState>
      <UserProvider>
        <WishlistProvider>
          <Layout>
            <Component {...pageProps} />
            <ToastContainer />
          </Layout>
         
        </WishlistProvider> 
      </UserProvider>
    </SearchState>
  ) 
}
