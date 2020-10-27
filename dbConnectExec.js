const sql = require('mssql')
const cpatteConfig = require('./config.js')

const config = {
    user: cpatteConfig.DB.user,
    password:  cpatteConfig.DB.password,
    server:  cpatteConfig.DB.server,
    database: cpatteConfig.DB.database, 
}
async function executeCustomerQuery(aQuery){
    var connection = await sql.connect(config)
    var result = await connection.query(aQuery)
    
    return result.recordset;
}

module.exports = {executeCustomerQuery: executeCustomerQuery}