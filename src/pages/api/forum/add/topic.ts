import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { Prisma } from "@prisma/client";
import { nextAuthOptions } from "@/lib/auth";
import { normalize } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let data: APIResponse;
  const session = await getServerSession(req, res, nextAuthOptions);
  let article: Prisma.ForumTopicUncheckedCreateInput;
  const { title, body, category } = req.body;

  const slug = normalize(title);

  article = {
    title: title,
    authorId: session?.user?.id as number,
    slug: slug,
    text: body,
    categoryId: typeof category == "string" ? parseInt(category) : category,
    featured: false,
  };

  try {
    const result = await prisma.forumTopic.create({
      data: article,
    });

    data = {
      status: 201,
      message: "Topic created successfully!",
      result: "/forum/topic/" + result.id + "/" + slug + "/",
    };
  } catch (err) {
    console.log("prisma error", err);
    data = {
      status: 200,
      message: "An error occurred: " + err,
      result: "error",
    };
  }
  res.json(data);
};

export default handler;
