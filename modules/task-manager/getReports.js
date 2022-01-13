import { getDB } from "modules/getdb"
import _ from "lodash"
export const getReports = async ({ filter = {}, page, size }) => {
  const db = await getDB()
  const data = await db
    .collection("reports")
    .find(filter)
    .skip((page - 1) * size)
    .limit(size)
    .toArray()
  let requests = _.map(data, ({ hash }) => hash)
  requests = await db
    .collection("requests")
    .find({ hash: { $in: requests } }, { name: 1, hash: 1 })
    .toArray()
  _.forEach(data, (report) => {
    const request = _.find(requests, { hash: report.hash })
    report.requestName = _.get(request, "name")
  })
  return data
}

export const getTotal = async (filter = {}) => {
  const db = await getDB()
  const total = await db.collection("reports").count(filter)
  return total
}
