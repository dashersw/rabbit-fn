const rqLib = require("amqplib")
const R = require("rambda")
const sendMessage = require("./sendMessage")

async function rabbitFn (optionalRabbitUrl) {
  try {
    const rabbitUrl = R.defaultTo(process.env.CLOUDAMQP_URL, optionalRabbitUrl)
    const rqConnection = await rqLib.connect(rabbitUrl)
    const rqChannel = await rqConnection.createChannel({ durable : true })

    return {
      channel     : rqChannel,
      sendMessage : R.curry(sendMessage, {rqChannel}),
    }
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = rabbitFn
