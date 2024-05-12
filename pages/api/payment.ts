import { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req)
  console.log(res)
  res.status(200).json({ status: "ok" })
}
