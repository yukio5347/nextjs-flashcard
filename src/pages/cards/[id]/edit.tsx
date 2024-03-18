import { GetStaticPaths, GetStaticProps } from 'next';

import { CardForm } from '@/components/CardForm';
import { cardStaticPaths, cardStaticProps } from '@/lib/queries';

import { CardType } from '.';

export const getStaticProps: GetStaticProps = async ({ params }) => cardStaticProps(params);
export const getStaticPaths: GetStaticPaths = async () => cardStaticPaths();

export default function Edit({ card }: { card: CardType }) {
  const cardData = {
    id: card.id,
    title: card.title,
    words: card.words
      .map((word) => {
        if (word.example) {
          return `${word.front} | ${word.back} | ${word.example}`;
        } else {
          return `${word.front} | ${word.back}`;
        }
      })
      .join('\n'),
  };

  return (
    <>
      <h1 className='mb-5 text-lg font-semibold'>Edit the card</h1>
      <CardForm card={cardData} />
    </>
  );
}
