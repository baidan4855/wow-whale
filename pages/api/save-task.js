import { saveTask } from "modules/task-manager"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const count = await saveTask(req.body.task)
    res.status(200).json({ status: "ok", result: count })
    return
  }
  res.status(405).json({ status: "error" })
}
