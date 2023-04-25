import { Card } from '@prisma/client';
import Link from 'next/link';
import { useEffect } from 'react';
import useSWR from 'swr';

import { useAlertContext } from '@/components/Alert';

export default function Home() {
  const { showAlert } = useAlertContext();
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading, mutate } = useSWR('/api/cards', fetcher);

  const destroy = async (card: Card, index: number) => {
    if (confirm(`You are about to delete "${card.title}"`)) {
      fetch(`/api/cards/${card.id}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (res.ok) {
            mutate(data);
          }
          return res.json();
        })
        .then((json) => showAlert(json.type, json.message));
    }
  };

  useEffect(() => {
    if (error) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      showAlert('error', error.message);
    }
  }, [error]);

  return (
    <>
      <h1 className='mb-5 text-lg font-semibold'>Your flash cards</h1>
      {isLoading ? (
        <div className='flex items-center'>
          <svg
            className='animate-spin mr-2 h-5 w-5 text-gray-500'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
          <span className='text-gray-500 text-sm'>Loading...</span>
        </div>
      ) : data ? (
        <div className='grid grid-cols-3 gap-5'>
          {data.map((card: Card, index: number) => (
            <div
              key={card.id}
              className='relative rounded-lg overflow-hidden border shadow transition-shadow hover:shadow-lg'
            >
              <Link href={`/cards/${card.id}`} className='py-4 px-6 pb-14 block'>
                <div className='font-semibold text-lg mb-2'>{card.title}</div>
                <p>
                  {card.content
                    .trim()
                    .split('\n')
                    .slice(0, 3)
                    .map((line) => line.split(',')[0])
                    .join(', ')}
                  ...
                </p>
              </Link>
              <div className='absolute bottom-4 left-6'>
                <Link
                  href={`/cards/${card.id}/edit`}
                  className='py-1 px-2 mr-3 inline-block rounded border border-sky-600 text-sky-600 text-xs  transition-colors hover:text-white hover:bg-sky-600'
                >
                  Edit
                </Link>
                <button
                  className='py-1 px-2 inline-block rounded border border-red-600 text-red-600 text-xs transition-colors hover:text-white hover:bg-red-600'
                  onClick={() => destroy(card, index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No flash cards found. Add a new one!</p>
      )}
      <Link
        href='/cards/new'
        className='py-2 px-4 mt-5 inline-block rounded bg-sky-500 text-sm text-white transition-colors hover:bg-sky-600'
      >
        New
      </Link>
    </>
  );
}
