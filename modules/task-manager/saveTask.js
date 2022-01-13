import { ObjectId } from "mongodb"
import { getDB } from "modules/getdb"
import _ from "lodash"
import { run } from "./taskRunner"
import { TASK_STATUS } from "./constants"
export const saveTask = async (task) => {
  const db = await getDB()
  const data = {
    _id: new ObjectId().valueOf().toString(),
    ...task,
    status: TASK_STATUS.WAITTING.code,
    createdAt: new Date(),
  }
  const result = await db.collection("tasks").insert(data)

  run(data)

  return result.insertedCount
}
