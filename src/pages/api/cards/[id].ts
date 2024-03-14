import { NextApiRequest, NextApiResponse } from 'next';

import { getErrorMessage } from '@/lib/helpers';
import { prisma } from '@/lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  const revalidateCard = async (res: NextApiResponse) => {
    await res.revalidate(`/cards/${id}`);
    await res.revalidate(`/cards/${id}/edit`);
  };

  if (req.method === 'PUT') {
    try {
      const card = await prisma.card.update({
        where: {
          id: id,
        },
        data: { title: req.body.title },
      });
      await prisma.word.deleteMany({
        where: {
          cardId: id,
        },
      });
      const words = req.body.words.split('\n').map((line: string) => {
        const [front, back] = line.split(',');
        return { front, back, cardId: card.id };
      });
      await prisma.word.createMany({ data: words });

      await revalidateCard(res);
      return res.status(200).json({
        type: 'info',
        message: 'The card has been updated.',
      });
    } catch (error) {
      return res.status(500).json({
        type: 'error',
        message: getErrorMessage(error),
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.word.deleteMany({
        where: {
          cardId: id,
        },
      });
      await prisma.card.delete({
        where: {
          id: id,
        },
      });
      await revalidateCard(res);
      return res.status(200).json({
        type: 'info',
        message: 'The card has been deleted.',
      });
    } catch (error) {
      return res.status(500).json({
        type: 'error',
        message: getErrorMessage(error),
      });
    }
  }
}
