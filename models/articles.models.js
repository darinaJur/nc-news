const db = require("../db/connection")

exports.selectArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles
    WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Article not found'})
        } else {
        return rows[0]
        }
    })
}

exports.selectArticles = () => {
    return db.query(`ALTER TABLE articles
    ADD COLUMN comment_count INT
    DEFAULT 0;
    `)
    .then(() => {
    return db.query(`UPDATE articles
    SET comment_count = (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id);
    `)
    })
    .then(() => {
        return db.query(`SELECT author, title, article_id, topic, created_at, votes, article_img_url, comment_count 
        FROM articles
        ORDER BY created_at DESC;`)
    })
    .then(({ rows }) => {
        return rows
    })
}

// FROM articles
// INNER JOIN comments ON comments.article_id = articles.articles_id