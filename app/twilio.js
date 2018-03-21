const twilio = require('twilio')
const l = require('./myLogger')
const appHost = process.env.APP_HOST
const twilioNum = process.env.TWILIO_NUM
const client = new twilio.RestClient()

module.exports = {
  createMsg: (body, toNumber) => {
    client.messages.create({
      body: body,
      to: toNumber,
      from: twilioNum
    }, (err, message) => {
      if (err) l(err)
      l(message.sid)
    })
  },
  getWebhook: (url) => twilio.webhook(authToken, { url: `${appHost}${url}` }),
  createTwimlResponse: content => {
    const twiml = new twilio.TwimlResponse()
    twiml.message = content
    return twiml
  }
}
