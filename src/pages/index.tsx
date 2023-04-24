import { Card } from '@prisma/client';
import { GetStaticProps } from 'next';
import Link from 'next/link';

import { useAlertContext } from '@/components/Alert';
import { serialize } from '@/lib/helpers';
import { prisma } from '@/lib/prisma';

export const getStaticProps: GetStaticProps = async () => {
  const cards = serialize(await prisma.card.findMany());
  return {
    props: { cards },
  };
};

export default function Home({ cards }: { cards: Card[] }) {
  const { showAlert } = useAlertContext();

  const destroy = async (card: Card, index: number) => {
    if (confirm(`You are about to delete "${card.title}"`)) {
      fetch(`/api/cards/${card.id}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (res.ok) {
            cards.splice(index, 1);
          }
          return res.json();
        })
        .then((json) => showAlert(json.type, json.message));
    }
  };

  return (
    <>
      <h1 className='mb-5 text-lg font-semibold'>Your flash cards</h1>
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
                  onClick={() => destroy(card, index)}
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
    </>
  );
}
