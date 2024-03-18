import { NextApiRequest, NextApiResponse } from 'next';

import { getErrorMessage } from '@/lib/helpers';
import { prisma } from '@/lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const cards = await prisma.card.findMany({
        include: {
          words: {
            take: 3,
          },
          _count: {
            select: { words: true },
          },
        },
      });

      return res.status(200).json(cards);
    } catch (error) {
      return res.status(500).json({
        type: 'error',
        message: getErrorMessage(error),
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const card = await prisma.card.create({
        data: { title: req.body.title },
      });
      const words = req.body.words.split('\n').map((line: string) => {
        const [front, back, example] = line.split(' | ');
        return { front, back, example, cardId: card.id };
      });
      await prisma.word.createMany({ data: words });

      await res.revalidate(`/cards/${card.id}`);
      return res.status(200).json({
        type: 'info',
        message: 'The card has been added.',
      });
    } catch (error) {
      return res.status(500).json({
        type: 'error',
        message: getErrorMessage(error),
      });
    }
  }
}
