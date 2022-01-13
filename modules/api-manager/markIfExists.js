import { getDB } from "modules/getdb"
import _ from "lodash"

export const markIfExists = async (reqs) => {
  const db = await getDB()
  const hashs = _.map(reqs, (r) => r.hash)

  const exists = await db
    .collection("requests")
    .find({ hash: { $in: hashs } }, { hash: 1 })
    .toArray()
  let marked = _.map(reqs, (req) => {
    const curExists = !!_.find(exists, { hash: req.hash })
    return { ...req, exists: curExists }
  })
  return marked
}
