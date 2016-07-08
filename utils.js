var chrono = require('chrono-node')

module.exports = {
  getDateFromString: function(string){
    if (chrono.parse(string)) console.log(true)
    else false
    return chrono.parse(string)[0].start.date()
  }
}
