import { saveRequests } from "modules/api-manager"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const count = await saveRequests(req.body.requests)
    res.status(200).json({ status: "ok", result: count })
    return
  }
  res.status(405).json({ status: "error" })
}
