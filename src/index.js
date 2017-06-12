const rqLib = require("amqplib")
const R = require("rambda")
const sendMessage = require("./sendMessage")
const receiveMessage = require("./receiveMessage")

async function rabbitFn (optionalRabbitUrl) {
  try {
    const rabbitUrl = R.defaultTo(process.env.RABBIT_URL, optionalRabbitUrl)
    const rqConnection = await rqLib.connect(rabbitUrl)
    const rqChannel = await rqConnection.createChannel({ durable : true })

    function receiveMessageCallback({queue, durable, acknowledge}, callback){
      const durableFlag = R.defaultTo(true, durable)
      const acknowledgeFlag = R.defaultTo(false, acknowledge)

      rqChannel.assertQueue(queue, { durable : durableFlag })
      rqChannel.consume(queue, message => {
        if(acknowledgeFlag === true){
          rqChannel.ack(message)
        }
        callback(message)
      })
    }

    return {
      channel     : rqChannel,
      sendMessage : R.partialCurry(sendMessage, {rqChannel}),
      receiveMessage : R.partialCurry(receiveMessage, {rqChannel}),
      receiveMessageCallback: receiveMessageCallback
    }
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = rabbitFn
