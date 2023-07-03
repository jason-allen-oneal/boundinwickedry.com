import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let data: APIResponse;

  const { firstName, lastName, email, message } = req.body;

  try {
    data = {
      status: 200,
      message: "Email sent successfully!",
      result: "ok",
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
