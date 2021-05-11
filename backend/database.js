const { Pool } = require('pg');
class Database {
    constructor(){
        this.pool = new Pool({connectionString:"postgres://eahuades:lUS9GNIv8WITduW1JawMXYFgaIjSWh3Z@arjuna.db.elephantsql.com:5432/eahuades"});
    }

    GetUser(email, callback) {
        this.pool
        .query('SELECT password,username FROM "users" WHERE email = $1',[email], (err,res) => {
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


    resetTables(callback) {
        this.pool
        .query('DELETE FROM customers; DELETE FROM companies', (err, res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })
        /**
         * return a promise that resolves when the database is successfully reset, and rejects if there was any error.
         */
    }

    closeDatabaseConnections() {
        /**
         * return a promise that resolves when all connection to the database is successfully closed, and rejects if there was any error.
         */
    }

    getCompanyByQueueID(queue_id){
        this.pool.query('SELECT * FROM companies WHERE queueID = $1 LIMIT 1', [queue_id], (err, res) => {
            if(err){return {'error':err,'results':null}}
            return {'error':null,'results':res.rows[0]  }
        })
    }

    
    CreateQueue(company_id, queue_id, callback) {
        this.pool
        .query(`INSERT INTO companies (companyID, queueID, status) VALUES($1, $2, $3)`, [company_id, queue_id, false], (err, res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })

    }

    UpdateQueue(queue_id, status, callback){
        this.pool
        .query(`UPDATE companies SET status = $1 WHERE queueid = $2`, [status, queue_id], (err, res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })

    }

    JoinQueue(customer_id, queue_id){
        this.pool
        .query(`INSERT INTO customers (customerID, queueID, isServed) VALUES($1, $2, $3)`, [customer_id, queue_id, false], (err, res) => {
            if(err){return {'error':err,'results':null}}
            return {'error':null,'results':res.rows}
        })
    }

    ServerAvail(queue_id, callback) {
        this.pool
        .query(`SELECT companies.queueID, customers.customerID, customers.queueID FROM companies INNER JOIN customers ON companies.queueID=customers.QueueID WHERE companies.queueID = $1 AND isServed = false ORDER BY timestamp ASC LIMIT 1`, [queue_id], (err, res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })
    }

    ServeCustomer(customer_id, queue_id, callback){
        this.pool.query('UPDATE customers SET isServed=true WHERE customerid=$1 AND queueid=$2', [customer_id,queue_id], (err, res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })
    }

    ArrivalRate(company_id, queue_id) {
        this.pool
        .query(``, [company_id, queue_id], (err, res) => {
            if(err){return {'error':err, 'result':null}}
            return {'error':null,'result':res.rows}
        })
    }

}

module.exports = Database;
