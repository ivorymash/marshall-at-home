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



//test api
app.post("/user", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log(username,password);

    db.GetUser(username, (result) => {
        // console.log(result);
        if (result.err != null) {
            console.log(result.err);
            return res.sendStatus(500);
        } else {
            console.log(result);
            var pass = result.results[0].password; //this is janky, there has to be a better way.

            bcrypt.compare(password, pass, function (err, result) {
                if (result == true) {
                    console.log("password is correct");
                } else {
                    console.log("bruh");
                }
            });

            return res.sendStatus(201);
        }
    })

})


function generateAccessToken(username) {
    //this token doesnt expire.
    return jwt.sign(username, process.env.TOKEN_SECRET);
}

//test token api
app.get("/token", (req, res) => {
    const username = req.body.username;

    var jwt = generateAccessToken(username);
    console.log(jwt);
    return res.send(200);

})

//create user api
app.post("/user", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username, password);
    //do some filtering and testing here
    if (username == null || password == null) {
        return res.sendStatus(412);
    }
    //bcrypt
    bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) { return res.sendStatus(500) };

        db.CreateUser(username, hash, (result) => {
            if (result.err != null) {
                console.log(result.err);
                return res.sendStatus(500);
            } else {
                console.log(result);
                return res.sendStatus(201);
            }
        });

    });

})

app.post('/reset', (req, res) => {
    db.resetTables((result) => {
        console.log('result' + result.err);
        if (result.err != null) {
            return res.sendStatus(500);
        } else {
            console.log(result);
            return res.sendStatus(200);
        }
    }) //reset it
})

/**
 * ========================== COMPANY =========================
 */

app.route('/company/queue') //use route for easier management of routes

    /**
     * Company: Create Queue DONE: Jasper
     */
    .post((req, res) => {
        try {

            if (verifyJSON(req.body) == false) { //fails
                return res.status(400).send({ 'error': 'Error in Req params.', 'code': 'INVALID_JSON_BODY' }); //Error in query parameters
            }

            const company_id = req.body.company_id;
            const queue_id = req.body.queue_id.toUpperCase();

            db.pool.query("SELECT * FROM companies WHERE queueID = $1", [queue_id], (err, res2) => { //check for existing Queue ID
                if (err != null) {
                    return res.status(400).send({ 'error': 'something happened.', 'code': 'QUEUE_EXISTS' })
                } else if (res2.rows.length != 0) {
                    return res.status(422).send({ 'error': 'smth smth alr exist.', 'code': 'QUEUE_EXISTS' })
                } else {
                    db.CreateQueue(company_id, queue_id, (result) => {
                        if (result.err != null) {
                            return res.sendStatus(500);
                        } else {
                            return res.sendStatus(201);
                        }
                    })
                }

            })

        } catch (error) {
            res.status(500).send({ 'error': error, 'code': 'UNEXPECTED_ERROR' })
        }
    })

    /**
     * Company: Update Queue DONE: Jasper
     */
    .put((req, res) => {
        try {
            const queue_id = req.query.queue_id.toUpperCase();
            const status = req.body.status.toUpperCase();

            if (status != "ACTIVATE" && status != "DEACTIVATE") {
                return res.status(400).send({ "error": "status needs to be 'ACTIVATE' or 'DEACTIVATE'", "code": "INVALID_JSON_BODY" })
            } //bad. Should pass both into the jsonVerify function. But needs to pass the different code thing.

            if (verifyJSON(req.query) == false) { //fails
                return res.status(400).send({ 'error': 'Error in Req params.', 'code': 'INVALID_QUERY_STRING' }); //Error in query parameters
            }

            // format the thing into the same way the db is made
            switch (status) {
                case "ACTIVATE":
                    var statusFormatted = true;
                    break;
                case "DEACTIVATE":
                    var statusFormatted = false
                    break;
            }

            db.pool.query("SELECT * FROM companies WHERE queueID = $1", [queue_id], (err, res2) => {
                if (res2.rows.length == 0) {
                    return res.status(404).send({ "error": `Queue ID ${queue_id} Not Found`, "code": "UNKNOWN_QUEUE" })
                } else {
                    db.UpdateQueue(queue_id, statusFormatted, (result) => {
                        if (result.err != null) {
                            return res.sendStatus(500);
                        } else {
                            return res.sendStatus(200);
                        }
                    });
                }
            })
        } catch (error) {
            res.status(500).send({ 'error': error, 'code': 'UNEXPECTED_ERROR' })
        }
    });



/**
 * Company: Server Available DONE: Jasper
 */
app.route('/company/server')
    .put((req, res) => {
        try {
            if (verifyJSON(req.body) == false) {
                return res.status(400).send({ 'error': 'Error in Req params.', 'code': 'INVALID_JSON_BODY' }); //Error in query parameters
            }
            //U NEED TO PUT THE VERIFY FUNCTION FIRST BEFORE TOUPPERCASE BECAUSE U CANNOT DO THE TOUPPERCASE FUCNTION ON A STRING

            const queue_id = req.body.queue_id.toUpperCase();

            db.pool.query("SELECT * FROM companies WHERE queueID = $1", [queue_id], (err, res2) => { //we in callback hell baby probably shouldve used promises

                if (res2.rows.length == 0) {
                    return res.status(404).send({ "error": `Queue ID ${queue_id} Not Found`, "code": "UNKNOWN_QUEUE" })
                } else {
                    db.ServerAvail(queue_id, (result) => {
                        if (result.err != null) {
                            return res.sendStatus(500);
                        } else if (result.results[0] == null) {
                            console.log(result.length)
                            return res.status(200).send({ "customer_id": 0 })
                        } else {
                            db.ServeCustomer(result.results[0].customerid, result.results[0].queueid, (results2) => {
                                if (results2.err != null) {
                                    return res.sendStatus(500);
                                } else {
                                    return res.status(200).send({ "customer_id": parseInt(result.results[0].customerid) });
                                }
                            })


                        }
                    })
                }

            })
        } catch (error) { console.log(error) }
    })

/**
 * ========================== CUSTOMER =========================
 */
app.route('/customer/queue')

    /**
     * Customer: Join Queue DONE: Xin Zhe
     */
    .post(async (req, res) => {
        try {

            if (verifyJSON(req.body) == false) {
                return res.status(400).send({ 'error': 'Error in Req params.', 'code': 'INVALID_JSON_BODY' }); //Error in query parameters
            }
            var customer_id = req.body.customer_id;
            var queue_id = req.body.queue_id.toUpperCase();

            db.pool.query(" SELECT * FROM companies WHERE queueID = $1 ", [queue_id], (req, res2) => {
                if (res2.rowCount == 0) {
                    return res.status(404).send({ "error": "Queue Id " + queue_id + " Not Found", "code": "UNKNOWN_QUEUE" })
                } else if (res2.rowCount != 0) {
                    db.pool.query("SELECT * FROM customers WHERE queueID = $1 AND customerID = $2", [queue_id, customer_id], (req, res3) => {
                        if (res3.rows.length != 0) {
                            return res.status(422).send({ 'error': 'Customer ' + customer_id + ' already in Queue ' + queue_id, 'code': 'ALREADY_IN_QUEUE' }); //
                        } else if (res3.rows.length == 0) {
                            db.pool.query("SELECT * FROM companies WHERE queueID = $1 AND status = $2", [queue_id, true], (req, res4) => {
                                if (res4.rowCount == 0) {
                                    return res.status(422).send({ "error": "Queue " + queue_id + " is inactive", "code": "INACTIVE_QUEUE" })
                                } else if (res4.rowCount == 1) {
                                    db.JoinQueue(customer_id, queue_id)
                                    return res.sendStatus(201);
                                }
                            })
                        }
                    })
                }
            })
        } catch (error) {
            console.log(error);
            return res.status(500).send({ 'error': error, 'code': 'UNEXPECTED_ERROR' });
        }
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
