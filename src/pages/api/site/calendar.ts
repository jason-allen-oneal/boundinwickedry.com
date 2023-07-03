import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { Prisma } from "@prisma/client";
import { nextAuthOptions } from "@/lib/auth";
import { normalize } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let data: APIResponse;
  const { start, end } = req.body;
  
  try {
    const events = await prisma?.events.findMany({
      where: {
        date: {
          lte: end,
          gte: start,
        },
      },
    });
    
    const monthEvents = [];
    for(const e of events){
      const obj = {
        id: e.id,
        title: e.title,
        description: e.description,
        dateShort: format(e.date, "dd-MM-yyyy"),
        date: e.date
      };
      
      monthEvents.push(obj);
    }
    
    data = {
      status: 200,
      message: "success",
      result: monthEvents,
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
