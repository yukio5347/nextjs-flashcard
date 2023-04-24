import { NextApiRequest, NextApiResponse } from 'next';

import { getErrorMessage } from '@/lib/helpers';
import { prisma } from '@/lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await prisma.card.create({
        data: req.body,
      });
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
