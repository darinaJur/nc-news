const { getArticleById, getArticles, getArticleCommentsById, postComment, patchVotes, postArticle } = require('../controllers/articles.controllers')

const articleRouter = require('express').Router()

articleRouter.get("/:article_id", getArticleById)

articleRouter.get("/", getArticles)

articleRouter.get("/:article_id/comments", getArticleCommentsById)

articleRouter.post("/:article_id/comments", postComment)

articleRouter.patch("/:article_id", patchVotes)

articleRouter.post("/", postArticle)

module.exports = articleRouter