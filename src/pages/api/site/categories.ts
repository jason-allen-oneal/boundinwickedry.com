import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const gallery = await prisma?.galleryCategory.findMany();
  
  const shop = await prisma?.shopCategory.findMany({
    where: {
      parent: 0
    }
  });

  const data = {
    status: 200,
    message: "Retrieved",
    result: {
      gallery: gallery,
      shop: shop,
    },
  };

  res.json(data);
};

export default handler;
