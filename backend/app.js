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

const checkToken = (req, res, next) => {
    console.log("here");
    const header = req.headers['authorization'];

    if (header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];
        console.log(token);

        if (token == 'undefined') {
            console.log("no jwt provided");
            return res.sendStatus(403);
        }

        req.token = token;
        next();
    } else {
        //If header is undefined return Forbidden (403)
        return res.sendStatus(403)
    }
}

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

        if (!email || !password) {
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
                if (result.results[0] == null) {
                    console.log("not exist user");
                    return res.status(401).send({ 'error': "user does not exist!" });
                }
                var pass = result.results[0].password; //this is janky, there has to be a better way.
                var username = result.results[0].username;
                var userid = result.results[0].id;
                var userType = result.results[0].usertype;
                var pfp = result.results[0].profile_pic_link;

                bcrypt.compare(password, pass, function (err, result) {
                    if (result == true) {
                        console.log("password is correct");
                        generateAccessToken(userid, email)
                            .then((token) => {
                                return res.status(202).send({ 'token': token, 'username': username, 'id': userid, 'userType': userType, 'profile_pic_link': pfp}); //if the js sees the 202 status, keep the name in session storagee
                            })
                    } else {
                        console.log("bruh");
                        return res.status(401).send({ 'error': 'password is wrong!' });
                    }
                });

            }
        })
    } catch (error) {
        res.status(500).send({ 'error': error, 'code': 'UNEXPECTED_ERROR' })

    }
})


async function generateAccessToken(id, email) {
    //this token doesnt expire.
    const temp = `{"id" : ${id}, "email" : "${email}"}`
    const usernameJson = JSON.parse(temp);
    const token = jwt.sign(usernameJson, process.env.TOKEN_SECRET);
    return token;
}

async function verifyJWT(token) {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(decoded);
    return decoded;
}

//test token api
app.get("/token", (req, res) => {
    const username = req.body.username;

    var jwt = generateAccessToken(username);
    console.log(jwt);
    return res.send(200);

})

//get quiz history
app.post("/user/profile/history", (req, res) => {
    const userid = req.body.userid;

    db.getQuizHistory(userid, (result) => {
        console.log(result);

        return res.send(result.results);
    });
})

app.get("/students", (req, res) => {

    db.getAllStudents((result) => {
        console.log(result);

        return res.send(result.results).status(200);
    })
})

app.post("/user/biometrics/create", (req,res) =>{ //set user biometrics
    console.log("ok");
    const id = req.body.userid;
    const height = req.body.height;
    const standing_reach = req.body.standing_reach;
    const wingspan = req.body.wingspan;

    console.log(id,height,standing_reach,wingspan)

    db.StoreUserBiometrics(id, standing_reach, height, wingspan, (result) => {
        if (result.error != null) {
            console.log("we got some shit here");
            console.log(result.error); //patch up this shit as it goes along
            return res.sendStatus(500);
        } else {
            console.log(result);
            console.log("created!");
            return res.sendStatus(201);
        }
    })
})

app.get("/user/biometrics", (req,res) =>{ //set user biometrics
    const id = req.body.userid;

    db.GetUserBiometrics(id, (result) => {
        if (result.error != null) {
            console.log("we got some shit here");
            console.log(result.error); //patch up this shit as it goes along
            return res.sendStatus(500);
        } else {
            console.log(result);
            return res.send(result.results).status(200);
        }
    })
})

//create user api
app.post("/user/create", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const userType = req.body.userType;
    console.log(username, password, email);
    //do some filtering and testing here
    if (username == null || password == null) {
        return res.sendStatus(412);
    }
    //bcrypt
    bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) { return res.sendStatus(500) };

        db.CreateUser(username, hash, email, userType, (result) => {
            if (result.error != null) {

                console.log("we got some shit here");

                console.log(result.error.detail); //patch up this shit as it goes along

                switch (result.error.code) {
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

//add student to lecturer PROTECTED API
app.post("/students/lecturer/update", checkToken, (req, res) => {
    var studentID = req.body.studentID;
    var lecturerID = req.body.lecturerID;

    verifyJWT(req.token)
        .then((decoded) => {
            console.log("here");
            //do a lil check to see if the jwt matches with the person alledgedly that is changing info
            if (decoded.id == lecturerID) {
                console.log("verified individual");
                db.assignLecturerToStudent(studentID, lecturerID, (result) => {
                    if (result.error != null) {
                        console.log("something went wrong");
                        console.log(result.error);
                        return res.sendStatus(400);
                    }

                    return res.status(202).send(`{"result" : "Updated student ${studentID}"}`);
                })
            }
            else {
                console.log("access denied");
                res.sendStatus(403)
            }
        })


})

//remove student from lecturer PROTECTED API
app.post("/students/lecturer/remove", checkToken, (req, res) => {
    var studentID = req.body.studentID;
    var lecturerID = req.body.lecturerID;

    verifyJWT(req.token)
        .then((decoded) => {
            console.log("here");
            //do a lil check to see if the jwt matches with the person alledgedly that is changing info
            if (decoded.id == lecturerID) {
                console.log("verified individual");
                db.removeLecturerFromStudent(studentID, (result) => {
                    if (result.error != null) {
                        console.log("something went wrong");
                        console.log(result.error);
                        return res.sendStatus(400);
                    }

                    return res.status(202).send(`{"result" : "Updated student ${studentID}"}`);
                })
            }
            else {
                console.log("access denied");
                res.sendStatus(403)
            }
        })
})

app.post("/students/myStudents", checkToken, (req, res) => {
    var id = req.body.id;
    console.log(id);

    verifyJWT(req.token)
        .then((decoded) => {
            //do a lil check to see if the jwt matches with the person alledgedly that is changing info
            if (decoded.id == id) {
                console.log("verified individual");
                db.getMyStudents(id, (result) => {
                    if (result.error != null) {
                        console.log("something went wrong");
                        console.log(result.error);
                        return res.sendStatus(400);
                    }

                    return res.status(202).send(result.results);
                })
            }
            else {
                console.log("access denied");
                res.sendStatus(403)
            }
        })

})



app.get("/questions", (req, res) => { //get a bunch of questions

    db.getQuestion((result) => {
        var jsonConstructed = `{"Questions" : [`


        for (i = 0; i < result.results.length; i++) {
            jsonConstructed += JSON.stringify(result.results[i]);
            jsonConstructed += `,`
        }
        jsonConstructed = jsonConstructed.substring(0, jsonConstructed.length - 1);
        jsonConstructed += `]}`;

        // console.log(jsonConstructed);

        return res.status(200).send(jsonConstructed);
    })

})

app.post("/article/create", (req, res) => {
    var authorId = req.body.authorId;
    var videolink = req.body.videolink;
    var title = req.body.title;
    var content = req.body.content;

    db.postArticle(authorId, videolink, title, content, (result) => {
        if (result.error != null) {
            console.log("something went wrong");
            console.log(result.error);
            return res.sendStatus(400);
        }
        console.log("cool");
        return res.sendStatus(200);
    })

})

app.post("/user/profile", (req, res) => { //get user from id
    var id = req.body.id;
    console.log("getting user of id " + id);

    db.GetUserFromId(id, (result) => {
        if (result.error != null) {
            console.log("something went wrong");
            console.log(result.error);
            return res.sendStatus(400);
        }
        console.log(result);
        return res.status(200).send(result.results);
    })
})

//update the user info
app.put("/user/profile/update", checkToken, (req, res) => {
    const id = req.body.id;
    const username = req.body.username;
    const email = req.body.email;
    const pfp = req.body.pfp; //profile picture
    verifyJWT(req.token)
        .then((decoded) => {
            console.log("here");
            //do a lil check to see if the jwt matches with the person alledgedly that is changing info
            if (decoded.id == id && decoded.email == email) {
                console.log("verified individual");
                db.updateProfile(id, username, pfp, (result) => {
                    if (result.error != null) {
                        console.log("something went wrong");
                        console.log(result.error);
                        return res.sendStatus(400);
                    }
                    generateAccessToken(id, email)
                        .then((token) => {
                            return res.status(202).send({ 'token': token, 'username': username, 'id': id }); //if the js sees the 202 status, keep the name in session storagee
                        })
                })
            }
            else {
                console.log("access denied");
                res.sendStatus(403)
            }
        })
})

app.post("/article", (req, res) => {
    var id = req.body.id;
    console.log(id);

    db.getArticle(id, (result) => {
        if (result.error != null) {
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
        if (result.error != null) {
            console.log("something went wrong");
            console.log(result.error);
            return res.sendStatus(400);
        }
        console.log("UHHHH");
        return res.status(200).send(result.results);
    })

})

app.post("/quiz/submit", (req, res) => { //submit quiz results
    const userid = req.body.userid;
    const totalQuestions = req.body.totalQuestions;
    const correctQuestions = req.body.correctQuestions;

    db.postQuizResult(userid, totalQuestions, correctQuestions, (result) => {
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
