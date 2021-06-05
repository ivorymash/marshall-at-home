const express = require('express'); // DO NOT DELETE
const cors = require('cors');
const morgan = require('morgan');
const app = express(); // DO NOT DELETE
const bodyParser = require('body-parser');
const Database = require('./database');
const db = new Database();
const dotenv = require('dotenv');

//password encryption
const bcrypt = require('bcrypt');
const saltRounds = 10;

//jwt functionality

const jwt = require('jsonwebtoken');

// get config vars
dotenv.config();

// access config var


//middleware jwt authentication
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err)

        if (err) return res.sendStatus(403)

        req.user = user
        console.log("Authorized JWT token");
        next()
    })
}


app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

/**
 * =====================================================================
 * ========================== CODE STARTS HERE =========================
 * =====================================================================
 */

/**
 * ========================== SETUP APP =========================
 */

/**
 * JSON Body // refer to verifyJson.js
 */
/**
 * ========================== RESET API =========================
 */



//login api
app.post("/user", (req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;

        if(!email || !password){
            return res.sendStatus(400);
        }

        console.log(email, password);

        db.GetUser(email, (result) => {
            // console.log(result);
            if (result.err != null) {
                console.log(result.err);
                return res.sendStatus(500);
            } else {
                console.log(result);
                if(result.results[0] == null){
                    console.log("not exist user");
                    return res.status(401).send({'error' : "user does not exist!"});
                }
                var pass = result.results[0].password; //this is janky, there has to be a better way.
                var username = result.results[0].username;
                var userid = result.results[0].id;

                bcrypt.compare(password, pass, function (err, result) {
                    if (result == true) {
                        console.log("password is correct");
                        generateAccessToken(username)
                            .then((token) => {
                                return res.status(202).send({ 'token': token, 'username' : username, 'id' : userid}); //if the js sees the 202 status, keep the name in session storagee
                            })
                    } else {
                        console.log("bruh");
                        return res.status(401).send({ 'error' : 'password is wrong!'});
                    }
                });

            }
        })
    } catch (error) {
        res.status(500).send({ 'error': error, 'code': 'UNEXPECTED_ERROR' })

    }
})


async function generateAccessToken(username) {
    //this token doesnt expire.
    const token = await jwt.sign(username, process.env.TOKEN_SECRET);
    return token
}

//test token api
app.get("/token", (req, res) => {
    const username = req.body.username;

    var jwt = generateAccessToken(username);
    console.log(jwt);
    return res.send(200);

})

app.post("/user/profile/history", (req,res) => { //get quiz history
    const userid = req.body.userid;

    db.getQuizHistory(userid, (result) => {
        console.log(result);

        return res.send(result.results);
    });
})

//create user api
app.post("/user/create", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    console.log(username, password, email);
    //do some filtering and testing here
    if (username == null || password == null) {
        return res.sendStatus(412);
    }
    //bcrypt
    bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) { return res.sendStatus(500) };

        db.CreateUser(username, hash, email, (result) => {
            if (result.error != null) {
                
                console.log("we got some shit here");
                
                console.log(result.error.detail); //patch up this shit as it goes along

                switch(result.error.code){
                    case "23505":
                        console.log("email already exists");
                        return res.status(401).send("email already exists!");
                        break;

                    default:
                        break;
                }

                return res.sendStatus(500);
            } else {
                console.log(result);
                console.log("created!");
                return res.sendStatus(201);
            }
        });

    });

})

app.get("/questions", (req,res) => { //get a bunch of questions

    db.getQuestion((result) => {
        var jsonConstructed = `{"Questions" : [`


        for(i=0; i<result.results.length; i++){
            jsonConstructed += JSON.stringify(result.results[i]);
            jsonConstructed += `,`
        }
        jsonConstructed = jsonConstructed.substring(0, jsonConstructed.length - 1);
        jsonConstructed += `]}`;

        // console.log(jsonConstructed);

        return res.status(200).send(jsonConstructed);
    })

})

app.post("/article/create", (req,res) => {
    var authorId = req.body.authorId;
    var videolink = req.body.videolink;
    var title = req.body.title;
    var content = req.body.content;

    db.postArticle(authorId, videolink, title, content, (result) => {
        if(result.error != null ){
            console.log("something went wrong");
            console.log(result.error);
            return res.sendStatus(400);
        }
        console.log("cool");
        return res.sendStatus(200);
    })

})

app.post("/user/profile", (req,res) => { //get user from id
    var id = req.body.id;
    console.log("getting user of id " + id);

    db.GetUserFromId(id, (result) => {
        if(result.error != null ){
            console.log("something went wrong");
            console.log(result.error);
            return res.sendStatus(400);
        }
        console.log(result);
        return res.status(200).send(result.results);
    })
})

app.post("/article", (req,res) => {
    var id = req.body.id;
    console.log(id);

    db.getArticle(id, (result) => {
        if(result.error != null ){
            console.log("something went wrong");
            console.log(result.error);
            return res.sendStatus(400);
        }
        console.log(result);
        return res.status(200).send(result.results);
    })
})

app.get("/article/sidebar", (req, res) => { //get articles summaries for sidebar

    db.getAllArticles((result) => {
        if(result.error != null ){
            console.log("something went wrong");
            console.log(result.error);
            return res.sendStatus(400);
        }
        console.log("UHHHH");
        return res.status(200).send(result.results);
    })

})

app.post("/quiz/submit", (req,res) => { //submit quiz results
    const userid = req.body.userid;
    const totalQuestions = req.body.totalQuestions;
    const correctQuestions = req.body.correctQuestions;

    db.postQuizResult(userid,totalQuestions,correctQuestions, (result) => {
        console.log(result);
        return res.sendStatus(200);
    })
    
})


/**
 * ========================== UTILS =========================
 */

/**
 * 404
 */
app.use(function (req, res, next) {
    next(createError(404));
});

/**
 * Error Handler
 */
app.use(function (err, req, res, next) {
    console.log(err);
    const status = err.status(500);
    const error = {
        error: err.message("Unexpected Server Error"),
        code: err.code("UNEXPECTED_SERVER_ERROR"),
    }
    res.status(status).json(error);
});


function tearDown() {
    // DO NOT DELETE
    return db.closeDatabaseConnections();
}

/**
 *  NOTE! DO NOT RUN THE APP IN THIS FILE.
 *
 *  Create a new file (e.g. server.js) which imports app from this file and run it in server.js
 */

module.exports = { app, tearDown }; // DO NOT DELETE
