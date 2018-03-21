'use strict'

const twilio = require('./app/twilio')
const express = require('express')
const bodyParser = require('body-parser')
const l = require('./app/myLogger')
const agenda = require('./app/agenda')

const app = express()
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get('/', (req, res) => {
  res.send('JDC Reminder App is Up')
})

// Create a route to respond to a call
app.post('/createReminder', twilio.getWebhook('/createReminder'), (req, res) => {
  l(JSON.stringify(req.body))

  let twiml
  const msg = req.body.Body.toLowerCase()
  const num = req.body.From
  // MSG FORMAT: remind tomorrow to pick up laundry

  if (msg.split(' ')[0] === 'remind') {
    const task = msg.split(' to ')[1]
    const date = msg.split(' to ')[0].replace(/remind\s/, '').trim()

    l(task, date)

    agenda.schedule(date,
      'create scheduled reminder',
      { task: task, number: num },
      (err, result) => {
        if (err) l(err)
        l(result)
      }
    )

    twiml = twilio.createTwimlResponse(`Reminder set to ${task} at ${date}!`)
  } else {
    twiml = twilio.createTwimlResponse('No valid command!')
  }
  res.send(twiml)
})

const port = process.env.PORT || 3000

app.listen(port, () => l(`Server listening on ${port}`))
