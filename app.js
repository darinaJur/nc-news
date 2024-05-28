const { getTopics } = require("./controllers/topics.controllers")

const express = require("express")

const app = express()

app.get("/api/topics", getTopics)

app.use((err, req, res, next) => {
    res.status(500).send('Server Error! :(')
})




module.exports = app