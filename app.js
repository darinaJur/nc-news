const { getTopics } = require("./controllers/topics.controllers")
const { getEndpoints } = require("./controllers/api.controllers")

const express = require("express")

const app = express()

app.use(express.json())

app.get("/api/topics", getTopics)

app.get("/api", getEndpoints)

app.use((err, req, res, next) => {
    res.status(500).send('Server Error! :(')
})




module.exports = app