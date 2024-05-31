const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
    return db
      .query(
        `SELECT articles.*, CAST((SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) AS INTEGER) AS comment_count FROM articles
      WHERE article_id = $1;`,
        [article_id]
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Article not found" });
        } else {
          return rows[0];
        }
      });
  };

exports.selectArticles = (topic) => {
  const validTopic = ["cats", "mitch", "paper"]

  if (topic && !validTopic.includes(topic)) {
    return Promise.reject({ status: 400, msg: "Invalid Input" })
  }

  let sqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    CAST((SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) AS INTEGER) AS comment_count
    FROM articles
    JOIN comments ON articles.article_id = comments.comment_id `
  const queryValues = []

  if (topic) {
    sqlQuery += "WHERE topic = $1"
    queryValues.push(topic)
  }

  sqlQuery += " ORDER BY created_at DESC;"

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows
  })
};

exports.checkTopicExists = (topic) => {
  return db
  .query(`SELECT * FROM topics WHERE slug = $1;`, [topic])
  .then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "No topic matching the topic query" })
    }
  })
}

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
    });
};

exports.selectArticleCommentsById = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.addComment = (commentToPost, article_id) => {
  if (commentToPost.body === "") {
    return Promise.reject({ status: 400, msg: "Cannot post empty comment" });
  } else {
    return db
      .query(
        `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3)
            RETURNING *;`,
        [commentToPost.username, commentToPost.body, article_id]
      )
      .then(({ rows }) => {
        if (!rows.length) {
          return Promise.reject({
            status: 404,
            msg: "Article not found and comment cannot be posted",
          });
        } else {
          return rows[0];
        }
      });
  }
};

exports.changeVotes = (article_id, voteValue) => {
  return db
    .query(
      `UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *`,
      [voteValue, article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else return rows[0];
    });
};
