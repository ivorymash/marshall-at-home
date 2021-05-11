const { Pool } = require('pg');
class Database {
    constructor(){
        this.pool = new Pool({connectionString:"postgres://eahuades:lUS9GNIv8WITduW1JawMXYFgaIjSWh3Z@arjuna.db.elephantsql.com:5432/eahuades"});
    }

    GetUser(email, callback) {
        this.pool
        .query('SELECT password,username, id FROM "users" WHERE email = $1',[email], (err,res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })
    }

    CreateUser(username, password,email, callback) {
        this.pool
        .query(`INSERT INTO Users (username, password, email) VALUES($1, $2, $3)`, [username, password, email], (err, res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })

    }

    getQuestion(callback) {
        this.pool
        .query(`SELECT question, id FROM "question_bank" ORDER BY random() LIMIT 5`, (err,res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })
    }

    getQuizHistory(userid, callback) {
        this.pool
        .query(`SELECT * FROM "quiz_history" WHERE user_id = $1 ORDER BY time_of_quiz DESC`, [userid], (err,res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })
    }

    
    postQuizResult(userid, callback) {
        this.pool
        .query(`INSERT into quiz_history(user_id,total_questions,correct_questions,time_of_quiz) values($1, $2, $3, current_timestamp);`, [userid,totalQuestions,correctQuestions], (err,res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })
    }

    // resetTables(callback) {
    //     this.pool
    //     .query('DELETE FROM customers; DELETE FROM companies', (err, res) => {
    //         if(err){return callback({'error':err,'results':null})}
    //         return callback({'error':err, 'results': res.rows})
    //     })
    //     /**
    //      * return a promise that resolves when the database is successfully reset, and rejects if there was any error.
    //      */
    // }

    closeDatabaseConnections() {
        /**
         * return a promise that resolves when all connection to the database is successfully closed, and rejects if there was any error.
         */
    }

}

module.exports = Database;
