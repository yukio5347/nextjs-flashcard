import { ParsedUrlQuery } from 'querystring';

import { serialize } from '@/lib/helpers';
import { prisma } from '@/lib/prisma';

export const cardStaticProps = async (params: ParsedUrlQuery | undefined) => {
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
    notFound: !card,
  };
};

export const cardStaticPaths = async () => {
  const cards = await prisma.card.findMany({ select: { id: true } });
  const paths = cards.map((card) => {
    return {
      params: {
        id: String(card.id),
      },
    };
  });
  return {
    paths,
    fallback: 'blocking' as const,
  };
};
