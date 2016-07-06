var twilio = require('express')
var express = require('express')
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
    console.log(message.sid);
});

var app = express();
// app.use(express.urlencoded());

// Create a route to respond to a call
app.post('/createReminder', function(req, res) {
    //Validate that this request really came from Twilio...
    if (twilio.validateExpressRequest(req, authToken)) {
      response.send('<Response><Sms>Voting is now closed.</Sms></Response>');
    }
    else {
        res.send('you are not twilio.  Buzz off.');
    }
});

app.listen(process.env.PORT || 3000);
