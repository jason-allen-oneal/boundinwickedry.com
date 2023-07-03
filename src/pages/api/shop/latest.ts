import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const items = await prisma?.item.findMany({
    take: 4,
    include: {
      ShopCategory: true,
    },
  });

  const data = {
    status: 200,
    message: "Retrieved",
    result: items,
  };

  res.json(data);
};

export default handler;
