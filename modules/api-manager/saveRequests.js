import { ObjectId } from "mongodb"
import { getDB } from "modules/getdb"
import _ from "lodash"
export const saveRequests = async (reqs) => {
  const db = await getDB()
  const data = _.map(reqs, ({ exists, ...rest }) => ({
    _id: new ObjectId().valueOf().toString(),
    ...rest,
    createdAt: new Date(),
  }))
  const result = await db.collection("requests").insertMany(data)
  return result.insertedCount
}
