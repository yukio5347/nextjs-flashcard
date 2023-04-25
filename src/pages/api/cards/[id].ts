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
      await prisma.card.update({
        where: {
          id: id,
        },
        data: req.body,
      });
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
