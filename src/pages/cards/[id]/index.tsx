import { Card } from '@prisma/client';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import CardComponent from '@/components/Card';
import ProgressBar from '@/components/ProgressBar';
import Toggle from '@/components/Toggle';
import { cardStaticPaths, cardStaticProps } from '@/lib/queries';

export const getStaticProps: GetStaticProps = async ({ params }) => cardStaticProps(params);
export const getStaticPaths: GetStaticPaths = async () => cardStaticPaths();

export default function Index({ card }: { card: Card }) {
  const [isRandom, setIsRandom] = useState(true);
  const [isBackward, setIsBackward] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [lines, setLines] = useState(getLines);
  const router = useRouter();
  const index = router.query.index ? Number(router.query.index) : 0;
  const line = lines[index]?.split(',');

  function getLines() {
    const lines = card.content.trim().split(/\n/);
    const shuffle = (array: string[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    return isRandom ? shuffle(lines) : lines;
  }

  useEffect(() => {
    setShowAnswer(false);
    setLines(getLines);
    router.push(`/cards/${card.id}?index=0`, undefined, { shallow: true });
  }, [isRandom, isBackward]);

  useEffect(() => {
    setShowAnswer(false);
  }, [router.query.index]);

  return (
    <>
      <h1 className='mb-5 text-lg font-semibold'>{card.title}</h1>
      <div className='grid grid-cols-2 gap-10 text-2xl'>
        {line ? (
          <>
            <CardComponent className='cursor-auto'>{isBackward ? line[1] : line[0]}</CardComponent>
            {showAnswer ? (
              <CardComponent
                onClick={() => router.push(`/cards/${card.id}?index=${index + 1}`, undefined, { shallow: true })}
                className='relative border shadow transition-shadow hover:shadow-lg'
              >
                {isBackward ? line[0] : line[1]}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 256 512'
                  className='absolute right-0 w-8 h-8 fill-gray-700'
                >
                  <path d='M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z' />
                </svg>
              </CardComponent>
            ) : (
              <CardComponent
                onClick={() => setShowAnswer(true)}
                className='border shadow transition-shadow hover:shadow-lg'
              >
                <span className='animate-bounce text-4xl'>?</span>
              </CardComponent>
            )}
          </>
        ) : (
          <>
            <CardComponent
              onClick={() => router.push(`/`)}
              className='flex flex-col shadow transition-shadow hover:shadow-lg'
            >
              Back to home
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512' className='mt-3 w-8 h-8 fill-gray-700'>
                <path d='M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z' />
              </svg>
            </CardComponent>
            <CardComponent
              onClick={() => {
                setLines(getLines);
                router.push(`/cards/${card.id}?index=0`, undefined, { shallow: true });
              }}
              className='flex flex-col shadow transition-shadow hover:shadow-lg'
            >
              Restart
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' className='mt-3 w-8 h-8 fill-gray-700'>
                <path d='M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z' />
              </svg>
            </CardComponent>
          </>
        )}
      </div>
      <ProgressBar molecule={index} denominator={lines.length} />

      <div className='flex items-start justify-between mt-10'>
        <div className='flex flex-col gap-5'>
          <Toggle label='Random' checked={isRandom} onChange={() => setIsRandom((prevState) => !prevState)} />
          <Toggle label='Backward' checked={isBackward} onChange={() => setIsBackward((prevState) => !prevState)} />
        </div>
        <p className='float-right'>
          <Link
            href='/'
            className='py-2 px-4 inline-block rounded bg-gray-200 text-sm transition-colors hover:bg-gray-300'
          >
            Back to home
          </Link>
        </p>
      </div>
    </>
  );
}
