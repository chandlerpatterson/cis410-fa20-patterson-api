//REQUIRE EXPRESS NODE MODULES
const express = require('express')

//REQUIRE BCRYPT
const bcrypt = require('bcryptjs')

//REQUIRE DB 
const db = require('./dbConnectExec.js')

//REQUIRE TOKEN
const jwt = require('jsonwebtoken')
const config = require('./config.js')

//CREATE APP FROM EXPRESS FUNCTION
const app = express();
app.use(express.json())

//CREATE FIRST ROUTE/ENDPOINT FOR APP (route/path, function(request, response))
//OTHER ROUTES: 1. app.post() 2. app.put() 3. app.delete()
//("/hi") = Endpoint http://localhost:5000/hi : Displays "Hello World" in Server
app.get("/hi",(req,res)=>{
    res.send("hello world")
})
//ASYNC FUNCTION WITH ENDPOINT POST FOR CUSTOMERS LOGIN (CLASS 11/3)
app.post("/customers/login", async (req,res)=> {
    //console.log(req.body)
    var email = req.body.email;
    var password = req.body.password;

    if(!email || !password){
        return res.status(400).send('Bad Request')
    }

    //1. CHECK USER EMAIL EXISTS IN DB
    var query = `SELECT * FROM Customer WHERE Email = '${email}'`
    //var result = await db.executeQuery(query);
        //CATCH ERRORS
        let result;
        try{
            result = await db.executeQuery(query)
        }catch(myError){
            console.log("Error in /customers/login:", myError);
            return res.status(500).send()
        }
    //console.log(result)

    if(!result[0]){
        return res.status(400).send("Invalid User Credentials")
    }
    
    //2. CHECK PASSWORD MATCHES
    let user = result[0]
    //console.log(user)

    if(!bcrypt.compareSync(password,user.Password)){
        console.log("Invalid Password");
        return res.status(400).send("Invalid User Credentials")
    }

    //3. GENERATE A TOKEN
    let token = jwt.sign({pk: user.CustomerPK}, config.JWT, {expiresIn: '60 Minutes'})
    console.log(token)

    //4. SAVE A TOKEN IN DB & SEND TOKEN/USER INFO BACK TO USER
    let setTokenQuery = `UPDATE Customer SET Token = '${token}' WHERE ContactPK = '${user.CustomerPK}`
    try{
        await db.executeQuery(setTokenQuery)
        res.status(200).send({
            token: token,
            user: {
                firstName: user.FirstName,
                lastName: user.LastName,
                email: user.Email,
                CustomerPK: user.CustomerPK
            }
        })
    }
    catch(myError){
        console.log("Error Setting User Token", myError);
        res.status(500).send()
    }

})
//ASYNC FUNCTION (AWAIT) & ENDPOINT PRODUCTS POST (CLASS 10/29)
app.post("/customers", async (req,res)=> {
    //res.send("Creating Customer")
    //console.log("request body", req.body)

var firstName = req.body.firstName;
var lastName = req.body.lastName;
var email = req.body.email;
var password = req.body.password;

//IF LOOP FOR ERRORS SEND BAD REQUEST MESSAGE
if(!firstName || !lastName || !email || !password){
    return res.status(400).send("Bad Request")
}

//ACCEPTING SINGLE QUOTE IN FIRST NAME & LAST NAME
firstName = firstName.replace("'", "''")
lastName = lastName.replace("'", "''")

//QUERY: CHECKING FOR DUPLICATE EMAIL
var emailCheckQuery = `SELECT Email FROM Customer WHERE Email = '${email}'`

var existingCustomer = await db.executeQuery(emailCheckQuery)
//console.log("Existing Email", existingEmail)
if(existingCustomer[0]){
    return res.status(409).send("Please Enter a Different Email.")
}

//HASH THE PASSWORD
var hashedPassword = bcrypt.hashSync(password) 
var insertQuery = `INSERT INTO Customer(FirstName, LastName, Email, Password) VALUES ('${firstName}', 
'${lastName}', '${email}', '${hashedPassword}')`

db.executeQuery(insertQuery)
.then(()=>{res.status(201).send()})
.catch((err)=>{
    console.log("Error in POST /customers", err)
    res.status(500).send()
})
})

//GET ENDPOINT FOR /PRODUCTS
app.get("/products",(req,res)=>{
    //GET DATA FROM DATABASE
    db.executeQuery(`SELECT * FROM Product`)
    .then((result)=>{
        res.status(200).send(result)
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).send()
    })
})

//GET ENDPOINT CUSTOMERS/:PK 
app.get("/customers/:pk", (req,res)=>{
    var pk = req.params.pk
    //console.log("My PK:" , pk)
    var customerQuery = `SELECT * FROM Customer LEFT JOIN OrderLineItem 
    ON OrderLineItem.CustomerFK = Customer.CustomerPK WHERE CustomerPK = ${pk}`

db.executeQuery(customerQuery)
.then((customers)=>{
    //console.log("Customers:", customers)
    if(customers[0]){
        res.send(customers[0])
    }else{
        res.status(404).send('Bad Request')
    }
}).catch((err)=>{
    console.log("Error in customers/pk", err)
    res.status(500).send()
})    
})    

//INITIALIZE APP (port number, what you want app to do when server is running)
app.listen(5000,()=>{console.log("App is Running on Port 5000")})

