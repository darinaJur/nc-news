const articles = require("../db/data/test-data/articles");
const {
  selectArticleById,
  selectArticles,
  selectArticleCommentsById,
  addComment,
  checkArticleExists,
  changeVotes,
  checkTopicExists,
  addArticle,
} = require("../models/articles.models");

exports.getArticleById = async (req, res, next) => {
  const { article_id } = req.params;
  try {
    const article = await selectArticleById(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  const { topic, sort_by, order, limit, p } = req.query;

  try {
    if (topic) {
      await checkTopicExists(topic);
      const articles = await selectArticles(topic, sort_by, order, limit, p);
      res.status(200).send({ articles });
    } else {
      const articles = await selectArticles(topic, sort_by, order, limit, p);
      const total_count = articles.length
      res.status(200).send({ articles, total_count });
    }
  } catch (err) {
    next(err);
  }
};

exports.getArticleCommentsById = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    await checkArticleExists(article_id)
    const comments = await selectArticleCommentsById(article_id)
    res.status(200).send({ comments });
  } catch (err) {
    next(err)
  }
};

exports.postComment = async (req, res, next) => {
  const commentToPost = req.body;
  const { article_id } = req.params;

  try {
    const comment = await addComment(commentToPost, article_id);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }

};

exports.patchVotes = async (req, res, next) => {
  const { article_id } = req.params;
  const voteValue = req.body.votes;

  try {
      const article = await changeVotes(article_id, voteValue)
      res.status(200).send({ article });
  } catch (err) {
    next (err)
  }
};

exports.postArticle = async (req, res, next) => {
  const articleToPost = req.body;

  try {
    const article = await addArticle(articleToPost)
    res.status(201).send({ article })
  } catch (err) {
    next(err)
  }
}