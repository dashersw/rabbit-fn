const R = require("rambda")

const receiveMessage = ({queue, rqChannel, durable, acknowledge}) => new Promise(resolve=>{
  const durableFlag = R.defaultTo(true, durable)
  const acknowledgeFlag = R.defaultTo(false, acknowledge)

  rqChannel.assertQueue(queue, { durable : durableFlag })
  rqChannel.consume(queue, message => {
    if(acknowledgeFlag === true){
      rqChannel.ack(message)
    }
    resolve(message)
  })
})

module.exports = receiveMessage
