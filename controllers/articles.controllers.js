const articles = require("../db/data/test-data/articles");
const {
  selectArticleById,
  selectArticles,
  selectArticleCommentsById,
  addComment,
  checkArticleExists,
  changeVotes,
  checkTopicExists,
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
  const { topic } = req.query;

  try {
    if (topic) {
      await checkTopicExists(topic);
      const articles = await selectArticles(topic);
      res.status(200).send({ articles });
    } else {
      const articles = await selectArticles();
      res.status(200).send({ articles });
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
