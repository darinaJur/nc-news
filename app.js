const { getTopics } = require("./controllers/topics.controllers")
const { getEndpoints } = require("./controllers/api.controllers")
const { getArticleById, getArticles, getArticleCommentsById, postComment, patchVotes } = require("./controllers/articles.controllers")
const { deleteComment } = require("./controllers/comments.controllers")
const { getUsers } = require("./controllers/users.controllers")

const express = require("express")

const app = express()

app.use(express.json())

app.get("/api/topics", getTopics)

app.get("/api", getEndpoints)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getArticleCommentsById)

app.post("/api/articles/:article_id/comments", postComment)

app.patch("/api/articles/:article_id", patchVotes)

app.delete("/api/comments/:comment_id", deleteComment)

app.get("/api/users", getUsers)


app.all('*', (req, res) => {
    res.status(404).send({msg: "The request path does not exist"})
})

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Invalid Input'} )
    } else if (err.code === '23502') {
        res.status(404).send({ msg: 'Article not found and comment cannot be posted'} )
    } else if (err.code === '23503') {
        res.status(400).send({ msg: 'This user does not exist'} )
    } else next(err)
})

app.use((err, req, res, next) => {
    if (err.msg) {
        res.status(err.status).send({msg: err.msg})
    } else next(err)
})

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({ msg: 'Server Error! :(' })
})




module.exports = app