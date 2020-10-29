const bcrypt = require('bcryptjs')

var hashedPassword = bcrypt.hashSync('soccer')
console.log(hashedPassword)

var hashTest = bcrypt.compareSync('soccer', hashedPassword)
console.log(hashTest)