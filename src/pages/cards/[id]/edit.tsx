import { Card } from '@prisma/client';
import { GetStaticPaths, GetStaticProps } from 'next';

import { CardForm } from '@/components/CardForm';
import { serialize } from '@/lib/helpers';
import { prisma } from '@/lib/prisma';

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = Number(params?.id);
  const card = serialize(
    await prisma.card.findUnique({
      where: {
        id: id,
      },
    }),
  );
  return {
    props: { card },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const cards = await prisma.card.findMany({ select: { id: true } });
  const paths = cards.map((card) => {
    return {
      params: {
        id: String(card.id),
      },
    };
  });
  return {
    paths: paths,
    fallback: false,
  };
};

export default function Edit({ card }: { card: Card }) {
  return (
    <>
      <h1 className='mb-5 text-lg font-semibold'>Edit the card</h1>
      <CardForm card={card} />
    </>
  );
}
