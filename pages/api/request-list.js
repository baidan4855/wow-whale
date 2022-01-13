import { getRequests, getTotal } from "modules/api-manager"

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { name = null, page = 1, size = 10 } = req.query || {}
    const filter = {}
    if (name) {
      filter.name = name
    }
    const requests = await getRequests({ filter, page: +page, size: +size })
    const total = await getTotal(filter)
    res.status(200).json({
      status: "ok",
      result: {
        page,
        size,
        requests,
        total,
      },
    })
    return
  }
  res.status(405).json({ status: "error" })
}
