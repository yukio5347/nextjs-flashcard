import { Card } from '@prisma/client';
import { GetStaticPaths, GetStaticProps } from 'next';

import { CardForm } from '@/components/CardForm';
import { cardStaticPaths, cardStaticProps } from '@/lib/queries';

export const getStaticProps: GetStaticProps = async ({ params }) => cardStaticProps(params);
export const getStaticPaths: GetStaticPaths = async () => cardStaticPaths();

export default function Edit({ card }: { card: Card }) {
  return (
    <>
      <h1 className='mb-5 text-lg font-semibold'>Edit the card</h1>
      <CardForm card={card} />
    </>
  );
}
