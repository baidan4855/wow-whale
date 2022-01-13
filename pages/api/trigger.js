import { run } from "modules/taskrunner"

export default async function handler(req, res) {
  const result = await run()
  res.status(200).json({ status: "ok", result })
}
