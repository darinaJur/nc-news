const db = require("../db/connection")

exports.selectUsers = () => {
    return db.query(`SELECT * from users;`)
    .then(({ rows }) => {
        return rows
    })
}