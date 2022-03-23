var mysql = require("mysql");

var pool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "123456",
    database: "shop"
})

exports.query = (sql, arr) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
                return;
            }
            var arg = [sql];
            arr ? arg.push(arr) : null;
            arg.push(function (err, res) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(res);
                pool.releaseConnection(connection);
            })
            connection.query(...arg)
        })
    })
}