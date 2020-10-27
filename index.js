//REQUIRE EXPRESS NODE MODULES
const express = require('express')
//CREATE APP FROM EXPRESS FUNCTION
const app = express();

//CREATE FIRST ROUTE FOR APP (route/path, function(request, response))
//("/hi") = Endpoint
//http://localhost:5000/hi : Displays "Hello World" in Server
app.get("/hi",(req,res)=>{
    res.send("hello world")
})

//OTHER ROUTES: 1. app.post() 2. app.put() 3. app.delete()

//INITIALIZE APP (port number, what you want app to do when server is running)
app.listen(5000,()=>{console.log("App is Running on Port 5000")})