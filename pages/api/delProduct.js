import prisma from "utils/prisma";

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
      const { productId } = req.query;

      try {
        await prisma.product.delete({
          where: {
            id: parseInt(productId),
          },
        });


        res.status(204).end();
      } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'Error' });
      } finally {
        await prisma.$disconnect();
      }
    } else {
      // Not a DELETE request
      res.status(405).end();
    }
  };