//REQUIRE EXPRESS NODE MODULES
const express = require('express')

//DB 
const db = require('./dbConnectExec.js');

//CREATE APP FROM EXPRESS FUNCTION
const app = express();

//CREATE FIRST ROUTE FOR APP (route/path, function(request, response))
//("/hi") = Endpoint
//http://localhost:5000/hi : Displays "Hello World" in Server
app.get("/hi",(req,res)=>{
    res.send("hello world")
})

//OTHER ROUTES: 1. app.post() 2. app.put() 3. app.delete()

//GET ENDPOINT FOR /CUSTOMERS
app.get("/customers",(req,res)=>{
    //GET DATA FROM DATABASE
    db.executeCustomerQuery(`SELECT * FROM Customer`)
    .then((result)=>{
        res.status(200).send(result)
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).send()
    })
})

//ENDPOINT CUSTOMERS/:PK (NOT WORKING - CONSOLE LOG DOESN'T SHOW)
app.get("/customers/:pk", (req,res)=>{
    var pk = req.params.pk
    //console.log("My PK:" , pk)
    var myQuery = `SELECT * FROM Customer LEFT JOIN Product ON product.ProductPK = customer.ProductPK WHERE CustomerPK = ${pk}`
db.executeCustomerQuery(myQuery)
.then((customers)=>{
    //console.log("Customers:", customers)
    if(customers[0]){
        res.send(customers[0])
    }else{
        res.status(404).send('Bad Request')
    }
}).catch((err)=>{
    console.log("Erro in customers/pk", err)
    res.status(500).send()
})    
})    

//INITIALIZE APP (port number, what you want app to do when server is running)
app.listen(5000,()=>{console.log("App is Running on Port 5000")})

