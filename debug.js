require("env-fn")()
const rabbitFn = require("./src/")
const R = require("rambda")
const delay = ms => new Promise(resolve=>{
  setTimeout(function () {
    resolve()
  }, ms);
})

const sortFn = (a, b) => a - b

const debug = async () => {
  try{
    const rabbit = await rabbitFn()
    const results = []
    const sentMessages = []
    rabbit.receiveMessageCallback({queue: "bar", acknowledge: true}, receivedMessage=>{
      console.log("received", receivedMessage.content.toString("utf8"))

      results.push(receivedMessage.content.toString("utf8"))
    })
    for(const _ of R.range(0,5)){
      const message = `foo${Math.random()}`
      sentMessages.push(message)
      await rabbit.sendMessage({
        message:message,
        queue:"bar"
      })
      console.log("sent", message)
      await delay(200)
    }
    await delay(200)
    const result = R.equals(R.sort(sortFn,results),R.sort(sortFn,sentMessages))
    console.log(R.sort(sortFn,results))
    console.log(R.sort(sortFn,sentMessages))
    console.log(result,true)
  }catch(err){
    console.log(err)
  }
}


const debugAlt = async () => {
  try{
    const rabbit = await rabbitFn()
    const message = `foo${Math.random()}`
    await rabbit.sendMessage({
      message:message,
      queue:"baz"
    })
    const receivedMessage = await rabbit.receiveMessage({queue: "baz", acknowledge: true})
    console.log(receivedMessage.content.toString("utf8") === message, true)
    debug()
  }catch(err){
    console.log(err)
  }
}

debugAlt()
