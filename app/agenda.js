const Agenda = require('agenda')
const twilio = require('./twilio')
const mongoConnectionString = process.env.MONGODB_URI
const agenda = new Agenda({ db: { address: mongoConnectionString, collection: 'reminders' } })

agenda.define('create scheduled reminder', job => {
  const body = job.attrs.data.task
  const toNumber = job.attrs.data.number
  twilio.createMsg(body, toNumber)
})

agenda.on('ready', () => agenda.start())

module.exports = agenda
