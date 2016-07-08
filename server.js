'use strict'

var twilio = require('express')
var express = require('express')
var bodyParser = require('body-parser')
var utils =  require('./utils')
var Agenda = require('agenda')

require('dotenv').config()

var accountSid = process.env.ACCOUNT_SID // Your Account SID from www.twilio.com/console
var authToken = process.env.AUTH_TOKEN   // Your Auth Token from www.twilio.com/console
var appHost = process.env.APP_HOST
var mongoConnectionString = process.env.MONGODB_URI
var twilioNum = process.env.TWILIO_NUM
var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);
var agenda = new Agenda({db: {address: mongoConnectionString, collection: 'reminders'}});

agenda.define('create scheduled reminder', function(job) {
  client.messages.create({
      body: job.attrs.data.task,
      to: job.attrs.data.number,  // Text this number
      from: twilioNum // From a valid Twilio number
  }, function(err, message) {
      if (err) console.log(err)
      console.log(message.sid)
  })
})

agenda.on('ready', function() {
  agenda.start();

});

function createReminder(date, task, number) {
  agenda.schedule(date, 'create scheduled reminder', {task, number}, (err, result) => {
    if (err) console.log(err)
    console.log(result)
  })
}

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/', (req, res) => {
  res.send('Hello')
})

// Create a route to respond to a call
app.post('/createReminder', twilio.webhook(authToken, {url: `${appHost}/createReminder`}), function(req, res) {
  console.log(JSON.stringify(req.body))

  var twiml = new twilio.TwimlResponse();
  var msg = req.body.Body.toLowerCase()
  var num = req.body.From
  // MSG FORMAT: remind tomorrow to pick up laundry

  if (msg.split(' ')[0] === 'remind') {
    var task = msg.split(' to ')[1]
    var timeString = msg.split(' to ')[0].replace(/remind\s/, '')

    console.log(task, timeString)

    // var time = utils.getDateFromString(timeString)

    var time = timeString.trim()

    createReminder(time, task, num)

    twiml.message(`Reminder set to ${task} at ${time.toString()}!`)
  } else {
    twiml.message('No valid command!')
  }
  res.send(twiml);
});

app.listen(process.env.PORT || 3000);
