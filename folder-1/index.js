/*this file is the 'entry point' to get the other modules*/
/*get everything in folder-1*/

var test = require('./saysmom.js');
console.log("index reached");

/*module.exports.test = the string wow*/
module.exports = {
  saysmom : test
}
