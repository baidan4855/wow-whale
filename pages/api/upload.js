import { IncomingForm } from "formidable"
import { readFileSync } from "fs"

import _ from "lodash"
import { parse, markIfExists } from "modules/api-manager/"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = await new Promise((resolve, reject) => {
      new IncomingForm().parse(req, (err, fields, files) => {
        if (err) reject(err)
        resolve({ fields, files })
      })
    })
    if (!data.files.file) {
      res.status(200).json({ status: "error", result: "file not found" })
      return
    }
    let result = readFileSync(data.files.file.filepath, { encoding: "utf-8" })
    result = parse(result)
    result = await markIfExists(result)
    res.status(200).json({ status: result ? "ok" : "error", result })
    return
  }
  res.status(405).json({ status: "error" })
}
