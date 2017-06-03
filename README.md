# rabbit-fn

## Requirements

- process.env.CLOUDAMQP_URL

## Usage

```
const rabbitFn = require("rabbit-fn")
const rabbit = await rabbitFn()
expect(
  rabbit
).toHaveTyping({
  sendMessage: Function,
  channel: RabbitMqChannelObject
})
const publishOptions = {
  messageToSend
}
rabbit.sendMessage({
  publishOptions
})
```
