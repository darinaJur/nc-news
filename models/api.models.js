const db = require("../db/connection")
const fs = require("fs/promises")

exports.selectEndpoints = () => {

    return fs.readFile("/Users/darina/Documents/Northcoders/be-nc-news/endpoints.json", "utf-8")
    .then((data) => {
        return JSON.parse(data)
    })

}