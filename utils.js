var chrono = require('chrono-node')

module.exports = {
  getDateFromString: function(string){
    return chrono.parse(string)[0].start.date()
  }
}
