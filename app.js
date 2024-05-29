const { getTopics } = require("./controllers/topics.controllers")
const { getEndpoints } = require("./controllers/api.controllers")
const { getArticleById, getArticles } = require("./controllers/articles.controllers")

const express = require("express")

const app = express()

app.get("/api/topics", getTopics)

app.get("/api", getEndpoints)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.all('*', (req, res) => {
    res.status(404).send({msg: "The request path does not exist"})
})

app.use((err, req, res, next) => {
    if (err.msg) {
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({ msg: 'Server Error! :(' })
})




module.exports = app