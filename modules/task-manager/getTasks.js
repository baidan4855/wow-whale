import { getDB } from "modules/getdb"
import _ from "lodash"
export const getTasks = async ({ filter = {}, page, size }) => {
  const db = await getDB()
  const data = await db
    .collection("tasks")
    .find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * size)
    .limit(size)
    .toArray()
  return data
}

export const getTotal = async (filter = {}) => {
  const db = await getDB()
  const total = await db.collection("tasks").count(filter)
  return total
}
