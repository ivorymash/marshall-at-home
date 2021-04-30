const mysql = require('mysql2');  
var express = require("express");
var app = express();
const bodyparser = require('body-parser'); 
require('dotenv').config();
const env = process.env;

app.use(bodyparser.json());  

// Connection String to Database  
var mysqlConnection = mysql.createConnection({  
    host: env.DB_HOST,  
    user : env.DB_USER,  
    port: 3306,
    password : env.DB_PASSWORD,   
    database : env.DB_NAME,  
    multipleStatements : true  
});  

mysqlConnection.connect((err) => {  
    if(!err) {  
        console.log("Db Connection Succeed");  
    }  
    else{  
        console.log("Db connect Failed \n Error :" + JSON.stringify(err,undefined,2));  
    }  
});  

app.listen(env.SERVER_PORT,()=> console.log("Express server is running at port no : " + env.SERVER_PORT)); 

app.get('/users/all',(req,res)=>{  
    mysqlConnection.query('SELECT * FROM users',(err,rows,fields)=>{  
    if(!err)   
        res.send(rows);  
    else  
        console.log(err);  
      
    })  
}); 

//test api
app.get("/test", (req, res, next) => {
    res.json(["Tony","love","big","butts"]);
});