const articles = require("../db/data/test-data/articles")
const { selectArticleById, selectArticles, selectArticleCommentsById, addComment, checkArticleExists, changeVotes, checkTopicExists } = require("../models/articles.models")

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch(next)
}

exports.getArticles = (req, res, next) => {
    const { topic } = req.query

    if (topic) {
        checkTopicExists(topic)
        .then(() => {
            return selectArticles(topic)
        })
        .then((articles) => {
            res.status(200).send( { articles })
        })
        .catch(next)
    } else {
        selectArticles()
        .then((articles) => {
            res.status(200).send( { articles })
        })
        .catch(next)
    }
}

exports.getArticleCommentsById = (req, res, next) => {
    const { article_id } = req.params

    const promises = [selectArticleCommentsById(article_id), (checkArticleExists(article_id))]

    Promise.all(promises)
    .then((resolvedPromises) => {
        const comments = resolvedPromises[0]
        res.status(200).send( { comments })
    })
    .catch(next)
}

exports.postComment = (req, res, next) => {
    const commentToPost = req.body
    const { article_id } = req.params

    addComment(commentToPost, article_id).then((comment) => {
        res.status(201).send({ comment })
    })
    .catch(next)
}

exports.patchVotes = (req, res, next) => {
    const { article_id } = req.params
    const voteValue = req.body.votes

    changeVotes(article_id, voteValue).then((article) => {
        res.status(200).send({ article })
    })
    .catch(next)
}