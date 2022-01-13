import { getDB } from "modules/getdb"
import { TASK_STATUS } from "./constants"
import _ from "lodash"
import autocannon from "autocannon"

export const run = async (task) => {
  const db = await getDB()
  await db
    .collection("tasks")
    .updateOne(
      { _id: task._id },
      { $set: { status: TASK_STATUS.PROCESSING.code } }
    )
  const requests = await db
    .collection("requests")
    .find({ hash: { $in: task.requests } })
    .toArray()
  const taskConfig = _.pick(task, [
    "workers",
    "connections",
    "pipelining",
    "duration",
  ])
  const subTasks = _.map(requests, (req) => {
    const _req = _.pick(req, ["url", "method", "header", "body"])
    return {
      ..._req,
      ...taskConfig,
    }
  })
  const results = []
  let runIndex = 0
  const _run = async () => {
    if (runIndex >= subTasks.length) return results
    const result = await new Promise((resolve, reject) => {
      autocannon(subTasks[runIndex], (err, result) => {
        if (err) reject(err)
        resolve(result)
      })
    })
    results.push({
      hash: requests[runIndex].hash,
      taskId: task._id,
      ...result,
    })
    runIndex++
    return await _run()
  }
  const reports = await _run()
  await db
    .collection("tasks")
    .updateOne(
      { _id: task._id },
      { $set: { status: TASK_STATUS.FINISHED.code } }
    )
  await db.collection("reports").insertMany(reports)
  return reports
}
