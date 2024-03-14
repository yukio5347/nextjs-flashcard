import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import Head from 'next/head';

import { AlertProvider } from '@/components/Alert';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AlertProvider>
      <Head>
        <title>Flash Cards</title>
      </Head>
      <Component {...pageProps} />
    </AlertProvider>
  );
}
