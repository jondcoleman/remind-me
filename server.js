var twilio = require('express')
var express = require('express')
var bodyParser = require('body-parser')
var chrono = require('chrono-node')

require('dotenv').config()

var accountSid = process.env.ACCOUNT_SID // Your Account SID from www.twilio.com/console
var authToken = process.env.AUTH_TOKEN   // Your Auth Token from www.twilio.com/console
var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);

client.messages.create({
    body: 'Hello from Node',
    to: '+13017755903',  // Text this number
    from: '+12408984430' // From a valid Twilio number
}, function(err, message) {
    if (err) console.log(err)
    console.log(message.sid);
});

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}))

// Create a route to respond to a call
app.post('/createReminder', twilio.webhook(authToken, {url: 'https://remind-jc.herokuapp.com/createReminder'}), function(req, res) {
    console.log(JSON.stringify(req.body))
    var twiml = new twilio.TwimlResponse();
    twiml.message('Hello from node.js booi!');

    res.send(twiml);
});

app.listen(process.env.PORT || 3000);
