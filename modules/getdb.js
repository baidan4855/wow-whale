import { MongoClient } from "mongodb"

const constructGetDb = (mongoUrl) => {
  const client = new MongoClient(mongoUrl, {
    autoReconnect: true,
  })

  let isConnectedToDb = false

  return () =>
    new Promise((res, rej) => {
      if (isConnectedToDb) {
        res(client.db())
      } else {
        client.connect((err) => {
          if (err) {
            rej(err)
          } else {
            isConnectedToDb = true
            res(client.db())
          }
        })
      }
    })
}

export const getDB = () => {
  const { MONGO_URL } = process.env
  if (MONGO_URL === undefined) {
    console.error("Please config MONGO_URL in local env")
    process.exit(-1)
  }
  return constructGetDb(MONGO_URL)()
}
