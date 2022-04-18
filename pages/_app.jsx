import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            borderRadius: 6,
            fontSize: 14
          },
          success: {
            style: {
              background: '#FFFFFF',
              color: '#000000',
              fontWeight: '500'
            },
            iconTheme: {
              primary: '#4F46E5',
              secondary: '#ffffff'
            }
          },
          error: {
            style: {
              background: '#FFFFFF',
              color: '#000000',
              fontWeight: '500'
            },
            iconTheme: {
              primary: '#EE4444',
              secondary: '#ffffff'
            }
          }
        }}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
