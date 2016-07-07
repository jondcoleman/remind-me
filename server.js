'use strict'

var twilio = require('express')
var express = require('express')
var bodyParser = require('body-parser')
var chrono = require('chrono-node')
var CronJob = require('cron').CronJob
var utils =  require('./utils')

require('dotenv').config()

var accountSid = process.env.ACCOUNT_SID // Your Account SID from www.twilio.com/console
var authToken = process.env.AUTH_TOKEN   // Your Auth Token from www.twilio.com/console
var appHost = process.env.APP_HOST
var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);

function createReminder(date, task) {
  new CronJob(date, () => {
    client.messages.create({
        body: task,
        to: '+13017755903',  // Text this number
        from: '+12408984430' // From a valid Twilio number
    }, function(err, message) {
        if (err) console.log(err)
        console.log(message.sid)
    })
  }, null, true, 'America/New_York')

}
client.messages.create({
    body: 'Hello from Node',
    to: '+13017755903',  // Text this number
    from: '+12408984430' // From a valid Twilio number
}, function(err, message) {
    if (err) console.log(err)
    console.log(message.sid)
})

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/', (req, res) => {
  res.send('Hello')
})

// Create a route to respond to a call
app.post('/createReminder', twilio.webhook(authToken, {url: `${appHost}/createReminder`}), function(req, res) {
  console.log(JSON.stringify(req.body.Body))

  var twiml = new twilio.TwimlResponse();
  var msg = req.body.Body.toLowerCase()
  // remind tomorrow to pick up laundry
  if (msg.split(' ')[0] === 'remind') {
    var task = msg.split(' to ')[1]
    var timeString = msg.split(' to ')[0].replace(/remind\s/, '')
    console.log(task, timeString)
    var time = utils.getDateFromString(timeString)
    createReminder(time, task)
    twiml.message(`Reminder set to ${task} at ${time.toString()}!`)
  } else {
    twiml.message('No valid command!')
  }
  res.send(twiml);
});

app.listen(process.env.PORT || 3000);
