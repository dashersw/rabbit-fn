const R = require("rambda")

const sendMessage = async ({ queue, message, rqChannel, persistent }) => {
  const persistentFlag = R.defaultTo(true, persistent)
  await rqChannel.assertQueue(
    queue,
    { durable : true }
  )
  const messageToSend = Buffer.from(
    message,
    "utf8"
  )

  rqChannel.sendToQueue(
    queue,
    new Buffer(messageToSend),
    { persistent : persistentFlag }
  )
}

module.exports = sendMessage
