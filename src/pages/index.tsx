import { Card } from '@prisma/client';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';

import { serialize } from '@/lib/helpers';
import { prisma } from '@/lib/prisma';

export const getStaticProps: GetStaticProps = async () => {
  const cards = serialize(await prisma.card.findMany());
  return {
    props: { cards },
  };
};

export default function Home({ cards }: { cards: Card[] }) {
  const [flash, setFlash] = useState({ type: '', message: '' });

  async function deleteCard(card: Card, index: number): Promise<void> {
    if (confirm(`You are about to delete "${card.title}"`)) {
      const res = await fetch(`/api/cards/${card.id}`, {
        method: 'DELETE',
      });
      setFlash(await res.json());
      if (res.ok) {
        cards.splice(index, 1);
      }
    }
  }

  return (
    <main className='container'>
      <h1 className='mb-5 text-lg font-semibold'>Your flash cards</h1>
      {flash.message && (
        <>
          <div className={`${flash.type} relative p-4 mb-5 border-l-4 rounded-r-lg transition-opacity`} role='alert'>
            <p>{flash.message}</p>
            <button onClick={() => setFlash({ type: '', message: '' })} className='absolute top-0 bottom-0 right-0 p-4'>
              <svg
                className='fill-current h-6 w-6'
                role='button'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
              >
                <title>Close</title>
                <path d='M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z' />
              </svg>
            </button>
          </div>
        </>
      )}
      {cards ? (
        <div className='grid grid-cols-3 gap-5 mb-5'>
          {cards.map((card, index) => (
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
                  onClick={() => deleteCard(card, index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className='mb-5'>No flash cards found. Add a new one!</p>
      )}
      <Link
        href='/cards/new'
        className='py-2 px-4 inline-block rounded bg-sky-500 text-sm text-white transition-colors hover:bg-sky-600'
      >
        New
      </Link>
    </main>
  );
}
