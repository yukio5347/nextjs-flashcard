import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head />
      <body className='font-sans container py-10 bg-white text-gray-700'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
