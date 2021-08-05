const express = require('express'); // DO NOT DELETE
const cors = require('cors');
const morgan = require('morgan');
const app = express(); // DO NOT DELETE
const Database = require('./database');
const db = new Database();
const dotenv = require('dotenv');
const createError = require("http-errors");

//password encryption
const bcrypt = require('bcrypt');
const saltRounds = 10;

//jwt functionality

const jwt = require('jsonwebtoken');

// get config vars
dotenv.config();


app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

/**
 * =====================================================================
 * ========================== CODE STARTS HERE =========================
 * =====================================================================
 */

/**
 * ========================== MIDDLEWARES =========================
 */


//middleware jwt authentication
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err);

        if (err) return res.sendStatus(403);

        req.user = user;
        console.log("Authorized JWT token");
        next();
    });
}

// checks and returns the token from header
const checkToken = (req, res, next) => {
    console.log("here");
    const header = req.headers['authorization'];
    console.log(header);;

    if (header !== undefined) {
        const bearer = header.split(' ');
        const token = bearer[1];
        console.log(token);

        if (token == undefined) {
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
 * ========================== ASYNC FUNCTIONS =========================
 */

// generates jwt token when loging in or updating profile
async function generateAccessToken(id, email, userType) {
  //this token doesnt expire.
  const temp = `{"id" : ${id}, "email" : "${email}", "userType": ${userType}}`;
  const usernameJson = JSON.parse(temp);
  const token = jwt.sign(usernameJson, process.env.TOKEN_SECRET);
  return token;
}

// decodes available jwt token
async function verifyJWT(token) {
    // decoded contains id, email and userType
  const decoded = await jwt.verify(token, process.env.TOKEN_SECRET);
  return decoded;
}

/**
 * ========================== REGEX =========================
 */

const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
var escapeRegExp = (text) => {
  return text.replace(/[[\]{}()*+?,\\^$|#\s]/g, "\\$&");
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

        if (!email || !password || emailRegex.test(email) == false) {
            return res.status(400).send({ 'error' : "email is not valid!"});
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
                        generateAccessToken(userid, email, userType)
                            .then((token) => {
                                return res.status(202).send({ 'token': token, 'username': username, 'id': userid, 'userType': userType, 'profile_pic_link': pfp }); //if the js sees the 202 status, keep the name in session storagee
                            })
                    } else {
                        console.log("bruh");
                        return res.status(401).send({ 'error': 'password is wrong!' });
                    }
                });

            }
        });
    } catch (error) {
        res.status(500).send({ 'error': error, 'code': 'UNEXPECTED_ERROR' });

    }
});


// test token api 
// not in use
app.get("/token", (req, res) => {
    const username = req.body.username;

    var jwt = generateAccessToken(username);
    console.log(jwt);
    return res.send(200);

});

app.get("/baka", checkToken, (req, res) => {
  verifyJWT(req.token).then((decoded) => {
    var userType = decoded.userType;

    console.log("requesting for userType");
    console.log(decoded.userType);
    return res.send(userType.toString());
  });
});

// get quiz history
app.get("/user/profile/history", checkToken, (req, res) => {
    verifyJWT(req.token).then((decoded) => {
        console.log("checking if user is valid");
        var userid = decoded.id;
        if (userid != null) {
            db.getQuizHistory(userid, (result) => {
              console.log(result);

              return res.send(result.results);
            });
        } else {
            console.log("login first baka~");
            res.sendStatus(401);
        }
    });
});

app.get("/students", checkToken, (req, res) => {
    // console.log(req.token);
    verifyJWT(req.token).then((decoded) => {
        console.log("Checking if user is admin");
        if (decoded.userType === 2) {
            db.getAllStudents((result) => {
                console.log(result);
                console.log("admin is admin");
                return res.send(result.results).status(200);
            });
        } else {
            console.log("access denied");
            res.sendStatus(403);
        }
    });
});

// ! NOT IN USE YET
// TODO: REFACTOR CODE TO USE REQ.TOKEN
app.post("/user/biometrics/create", (req, res) => { //set user biometrics
    console.log("ok");
    const id = req.body.userid;
    const height = req.body.height;
    const standing_reach = req.body.standing_reach;
    const wingspan = req.body.wingspan;

    console.log(id, height, standing_reach, wingspan)

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
    });
});

// ! NOT IN USE YET
// TODO: REFACTOR CODE TO USE REQ.TOKEN
app.get("/user/biometrics", (req, res) => { //set user biometrics
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
    });
});

// !: IF WE ALLOW USERS TO CHOOSE USERTYPE, USERS CAN CREATE ADMIN ACCOUNTS TO SEE STUDENT DATA
//create user api
app.post("/user/create", (req, res) => {
    const username = escapeRegExp(req.body.username);
    const password = req.body.password;
    const email = req.body.email;
    const userType = req.body.userType;
    console.log(username, password, email);
    //do some filtering and testing here
    if (username == null || password == null) {
        return res.sendStatus(412);
    } else if (emailRegex.test(email) == false) {
      return res.sendStatus(400);
    } else {
      //bcrypt
      bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
          return res.sendStatus(500);
        }

        db.CreateUser(username, hash, email, userType, (result) => {
          if (result.error != null) {
            console.log("we got some shit here");

            console.log(result.error.detail); //patch up this shit as it goes along

            switch (result.error.code) {
              case "23505":
                console.log("email already exists");
                return res.status(401).send({message: "email already exists!"});
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
    }

});

// TODO: REFACTOR CODE TO USE REQ.TOKEN
//add student to lecturer PROTECTED API
app.post("/students/lecturer/update", checkToken, (req, res) => {
    var studentID = req.body.studentID;

    verifyJWT(req.token)
        .then((decoded) => {
            console.log("lecturer adding students to them");
            var userType = decoded.userType;
            var lecturerID = decoded.id;
            // just check if userType is admin
            if (userType === 2) {
                console.log("verified individual");
                db.assignLecturerToStudent(studentID, lecturerID, (result) => {
                    if (result.error != null) {
                        console.log("something went wrong");
                        console.log(result.error);
                        return res.sendStatus(400);
                    }
                    console.log("Added student")
                    return res
                      .status(202)
                      .send({ result: "Added student " + studentID });
                });
            }
            else {
                console.log("access denied");
                res.sendStatus(403)
            }
        });


});
// TODO: REFACTOR CODE TO USE REQ.TOKEN
//remove student from lecturer PROTECTED API
app.post("/students/lecturer/remove", checkToken, (req, res) => {
    var studentID = req.body.studentID;
    // var lecturerID = req.body.lecturerID;

    verifyJWT(req.token)
        .then((decoded) => {
            console.log("lecturer removing students to them");
            var userType = decoded.userType;
            //do a lil check to see if the jwt matches with the person alledgedly that is changing info
            if (userType === 2) {
                console.log("verified individual");
                db.removeLecturerFromStudent(studentID, (result) => {
                    if (result.error != null) {
                        console.log("something went wrong");
                        console.log(result.error);
                        return res.sendStatus(400);
                    }

                    return res.status(202).send({"result" : "Removed student " + studentID});
                });
            }
            else {
                console.log("access denied");
                res.sendStatus(403)
            }
        });
});

// TODO: REFACTOR CODE TO USE REQ.TOKEN
app.post("/students/myStudents", checkToken, (req, res) => {
    // var id = req.body.id;
    // console.log(id);

    verifyJWT(req.token)
        .then((decoded) => {
            var id = decoded.id;
            console.log("Checking if user is admin");
            //do a lil check to see if the jwt matches with the person alledgedly that is changing info
            if (decoded.userType === 2) {
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
        });

});

// TODO: REFACTOR CODE TO USE REQ.TOKEN
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
    });

});

// TODO: REFACTOR CODE TO USE REQ.TOKEN
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
    });

});

app.get("/user/profile", checkToken, (req, res) => { //get user from id

    verifyJWT(req.token).then((decoded) => {
        console.log("checking if user is valid");
        var id = decoded.id
        if (id != null) {
            db.GetUserFromId(id, (result) => {
              if (result.error != null) {
                console.log("something went wrong");
                console.log(result.error);
                return res.sendStatus(400);
              }
              console.log(result);
              return res.status(200).send(result.results);
            });
        } else {
            console.log("login first baka~");
            res.sendStatus(401);
        }
    });
});

//update the user info
app.put("/user/profile/update", checkToken, (req, res) => {
    // const id = req.body.id;
    const username = escapeRegExp(req.body.username);
    const email = escapeRegExp(req.body.email);
    const pfp = escapeRegExp(req.body.pfp); //profile picture
    verifyJWT(req.token)
        .then((decoded) => {
            console.log("here");
            var id = decoded.id
            const userType = decoded.userType;
            if (id != null) {
                console.log("updating user profile");
                db.updateProfile(id, username, pfp, email, (result) => {
                    if (result.error != null) {
                        console.log("something went wrong");
                        console.log(result.error);
                        return res.sendStatus(400);
                    }
                    generateAccessToken(id, email, userType)
                        .then((token) => {
                            return res.status(202).send({ 'token': token, 'username': username, 'id': id }); //if the js sees the 202 status, keep the name in session storagee
                        });
                });
            }
            else {
                console.log("access denied");
                res.sendStatus(403)
            }
        });
});

// TODO: REFACTOR CODE TO USE REQ.TOKEN
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
    });
});

// TODO: REFACTOR CODE TO USE REQ.TOKEN
app.get("/article/sidebar", (req, res) => { //get articles summaries for sidebar

    db.getAllArticles((result) => {
        if (result.error != null) {
            console.log("something went wrong");
            console.log(result.error);
            return res.sendStatus(400);
        }
        console.log("UHHHH");
        return res.status(200).send(result.results);
    });

});

// TODO: REFACTOR CODE TO USE REQ.TOKEN
app.post("/quiz/submit", (req, res) => { //submit quiz results
    const userid = req.body.userid;
    const totalQuestions = req.body.totalQuestions;
    const correctQuestions = req.body.correctQuestions;

    db.postQuizResult(userid, totalQuestions, correctQuestions, (result) => {
        console.log(result);
        return res.sendStatus(200);
    });

});

//This one is to host the server IP thing, bad implementation. Hope we do better next time.

// call this api when starting a game inside of VR.
app.post("/server/ip", (req, res) => { 
    const ip = req.body.ip;

    if (ip === "") {
        return res.sendStatus(400);
    }

    db.postIP(ip, (result) => {
      if (result.error != null) {
        console.log("something went wrong");
        console.log(result.error);
        return res.sendStatus(400);
      }
      console.log(result);
      return res.sendStatus(200);
    });
})

//by right there should only be 1 string that has the ip.
//by wrong we messed up, or the implementation was horribly done.

// call this when checking IP in desktop mode.
app.post("/server/ip/check", (req,res) => {
    const ip = req.body.ip;

    db.checkIP(ip, (result) => {
        if (result.error != null) {
            console.log("something went wrong");
            console.log(result.error);
            return res.sendStatus(400);
        }
        console.log(result);
        //do checking stuff
        if(result.results.length == 0){
            res.status(401).json({error : "session doesnt exist"});
        }else{
            console.log(result.results[0].AgeInMinutes);
            //check if the game was created less than 20 minutes ago, if so, we can assume that the ip is in use.
            if(result.results[0].AgeInMinutes < 20){
                res.status(200).json({message: "LETS GO"});
            }
            else{
                res.status(401).json({error : "session probably already ended"});
            }
        }
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
    console.error(err.stack);
    res.status(500).send("Unexpected Server Error");
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

module.exports = { app, generateAccessToken, verifyJWT, tearDown }; // DO NOT DELETE
