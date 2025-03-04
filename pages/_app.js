import { useEffect } from 'react';
import '@geotab/zenith/dist/index.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Any client-side initialization can go here
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp; 