const jwt = require('jsonwebtoken')
const config = require('../config.js')
const db = require('../dbConnectExec.js')
const auth = async(req, res, next)=>{
    //console.log(req.header("Authorization"))
    try{
    //1. DECODE TOKEN
        let myToken = req.header("Authorization")
        .replace('Bearer ', '')
        //console.log(myToken)
        let decodedToken = jwt.verify(myToken, config.JWT)
        //console.log(decodedToken)
        let customerPK = decodedToken.pk;
        console.log(customerPK)
    //2. COMPARE TOKEN WITH DB TOKEN
        let query = `SELECT CustomerPK, FirstName, LastName, Email
        FROM Customer
        WHERE CustomerPK = ${customerPK} and 
        TOKEN = '${myToken}'`
        
        let returnedUser = await db.executeQuery(query)
        //console.log(returnedUser)

    //3. SAVE USER INFORMATION IN REQUEST
        if(returnedUser[0]){
            req.customer = returnedUser[0]
            next()
        }else{res.status(401).send("Authentication Failed.")}

    }catch(myError){
        res.status(401).send("Authentication Failed.", myError)
    }
}

module.exports = auth