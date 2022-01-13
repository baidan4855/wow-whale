import { getReports, getTotal } from "modules/task-manager"

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { taskId = null, page = 1, size = 10 } = req.query || {}
    const filter = {}
    if (taskId) {
      filter.taskId = taskId
    }
    const reports = await getReports({ filter, page: +page, size: +size })
    const total = await getTotal(filter)
    res.status(200).json({
      status: "ok",
      result: {
        page,
        size,
        reports,
        total,
      },
    })
    return
  }
  res.status(405).json({ status: "error" })
}
