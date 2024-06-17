const { getTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/api.controllers");
const {
  getArticleById,
  getArticles,
  getArticleCommentsById,
  postComment,
  patchVotes,
} = require("./controllers/articles.controllers");
const { deleteComment } = require("./controllers/comments.controllers");
const { getUsers } = require("./controllers/users.controllers");
const topicsRouter = require("./routes/topics-router");
const articleRouter = require("./routes/articles-router");
const commentsRouter = require("./routes/comments-router");

const express = require("express");
const usersRouter = require("./routes/users-router");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api", getEndpoints);

app.use("/api/topics", topicsRouter);

app.use("/api/articles", articleRouter);

app.use("/api/comments", commentsRouter);

app.use("/api/users", usersRouter);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "The request path does not exist" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid Input" });
  } else if (err.code === "23502") {
    res
      .status(404)
      .send({ msg: "Article not found and comment cannot be posted" });
  } else if (err.code === "23503") {
    res.status(400).send({ msg: "This user does not exist" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server Error! :(" });
});

module.exports = app;
