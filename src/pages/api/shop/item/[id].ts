import { NextApiRequest, NextApiResponse } from "next";
import { getItem } from "@/lib/services/shop";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = parseInt(req.query.id as string);
  const item = await getItem(id);

  const data = {
    status: 200,
    message: "Retrieved",
    result: item,
  };

  res.json(data);
};

export default handler;
