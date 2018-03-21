const chrono = require('chrono-node')

const utils = {
  dateIsValid: string => chrono.parse(string).length > 0,
  getDateFromString: string => chrono.parse(string)[0].start.date(),
  log: content => console.log(content)
}

module.exports = utils
