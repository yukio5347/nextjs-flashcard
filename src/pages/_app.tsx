import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import { useEffect } from 'react';

import { AlertProvider, useAlertContext } from '@/components/Alert';

export default function App({ Component, pageProps }: AppProps) {
  const { type, message, hideAlert } = useAlertContext();

  useEffect(() => {
    if (message && type !== 'warning' && type !== 'error') {
      setTimeout(() => {
        hideAlert();
      }, 3000);
    }
  }, [message]);

  return (
    <AlertProvider>
      <Component {...pageProps} />
    </AlertProvider>
  );
}
