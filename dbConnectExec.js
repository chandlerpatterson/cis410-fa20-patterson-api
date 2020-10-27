const sql = require('mssql')
const cpatteConfig = requie('./config.js')

const config = {
    user: cpatteConfig.DB.user,
    password:  cpatteConfig.DB.password,
    server:  cpatteConfig.DB.server,
    database: cpatteConfig.DB.database, 
}
async function executeQuery(aQuery){
    var connection = await sql.connect(config)
    var result = await connection.query(aQuery)
    
    return result.recordset;
}

module.exports = {executeQuery: executeQuery}
//executeQuery(`SELECT * FROM movie LEFT JOIN genre ON genre.GenrePK = movie.GenreFK`)