const db = require("../db/connection");

exports.selectArticleById = async (article_id) => {
  const { rows } = await db.query(
    `
  SELECT articles.*, CAST((SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) AS INTEGER) AS comment_count FROM articles
  WHERE article_id = $1;`,
    [article_id]
  );
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Article not found" });
  } else {
    return rows[0];
  }
};

exports.selectArticles = async (topic) => {
  let sqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    CAST((SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) AS INTEGER) AS comment_count
    FROM articles `;
  const queryValues = [];

  if (topic) {
    sqlQuery += "WHERE topic = $1 ";
    queryValues.push(topic);
  }

  sqlQuery += "ORDER BY created_at DESC;";

  const { rows } = await db.query(sqlQuery, queryValues);
  return rows;
};

exports.checkTopicExists = async (topic) => {
  const { rows } = await db.query(`SELECT * FROM topics WHERE slug = $1;`, [
    topic,
  ]);

  if (!rows.length) {
    return Promise.reject({
      status: 404,
      msg: "No topic matching the topic query",
    });
  }
};

exports.checkArticleExists = async (article_id) => {
  const { rows } = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );

  if (!rows.length) {
    return Promise.reject({ status: 404, msg: "Article not found" });
  }
};

exports.selectArticleCommentsById = async (article_id) => {
  const { rows } = await db.query(
    `SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;`,
    [article_id]
  );
  return rows;
};

exports.addComment = async (commentToPost, article_id) => {
  if (commentToPost.body === "") {
    return Promise.reject({ status: 400, msg: "Cannot post empty comment" });
  } else {
    const { rows } = await db.query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3)
      RETURNING *;`,
      [commentToPost.username, commentToPost.body, article_id]
    );

    if (!rows.length) {
      return Promise.reject({
        status: 404,
        msg: "Article not found and comment cannot be posted",
      });
    } else return rows[0];
  }
};

exports.changeVotes = async (article_id, voteValue) => {
  const { rows } = await db.query(
    `UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *`,
    [voteValue, article_id]
  );

  if (!rows.length) {
    return Promise.reject({ status: 404, msg: "Article not found" });
  } else return rows[0];
};
