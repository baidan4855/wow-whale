import { getDB } from "modules/getdb"
import _ from "lodash"
export const getRequests = async ({ filter, page, size }) => {
  const db = await getDB()
  const data = await db
    .collection("requests")
    .find(filter)
    .skip((page - 1) * size)
    .limit(size)
    .toArray()
  return data
}

export const getTotal = async (filter) => {
  const db = await getDB()
  const total = await db.collection("requests").count(filter)
  return total
}
