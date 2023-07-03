import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const articles = await prisma?.forumTopic.findFirst({
    orderBy: {
      date: "desc",
    },
    include: {
      ForumCategory: true,
      User: true,
      Tags: true,
    },
  });

  const data = {
    status: 200,
    message: "Retrieved",
    result: articles,
  };

  res.json(data);
};

export default handler;
