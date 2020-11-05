const jwt = require('jsonwebtoken');
//TOKENS USED FOR VERIFICATION
let myToken = jwt.sign({pk: 1234},"secretPassword",{expiresIn: '60 Minutes'})
console.log('My Token', myToken)

let myDecoded = jwt.verify(myToken,'secretPassword');
console.log("My Decoded",myDecoded)