import _ from "lodash"
import md5 from "md5"

export const parse = (filecontent) => {
  try {
    if (!_.isString(filecontent)) return null
    const json = JSON.parse(filecontent)
    const requests = new Map()
    _.forEach(json.item, (item) => {
      const hash = md5(
        item.request.method +
          item.request.url.raw +
          _.get(item, "request.body.raw")
      )
      if (requests.has(hash)) {
        return true
      }
      let body = _.get(item, "request.body.raw", null)
      if (body) {
        body = JSON.parse(body)
      }

      const req = {
        hash,
        name: _.get(
          body,
          "operationName",
          "/" + decodeURI(item.request.url.path.join("/"))
        ),
        url: item.request.url.raw,
        method: item.request.method,
        header: _.reduce(
          item.request.header,
          (acc, { key, value }) => {
            acc[key] = value
            return acc
          },
          {}
        ),
        body: body ? JSON.stringify(body) : null,
      }
      requests.set(hash, req)
    })
    if (requests.size === 0) {
      return null
    }
    return Array.from(requests.values())
  } catch (err) {
    console.error(err)
    return null
  }
}
