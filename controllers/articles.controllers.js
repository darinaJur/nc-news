const { selectArticleById, selectArticles, selectArticleCommentsById, addComment } = require("../models/articles.models")

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch(next)
}

exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
        res.status(200).send({ articles })
    })
    .catch(next)
}

exports.getArticleCommentsById = (req, res, next) => {
    const { article_id } = req.params

    selectArticleCommentsById(article_id)
    .then((comments) => {
        res.status(200).send({ comments })
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