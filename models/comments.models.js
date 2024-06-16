const db = require("../db/connection");

exports.checkCommentExists = async (comment_id) => {
  const { rows } = await db.query(
    `SELECT * FROM comments
    WHERE comment_id = $1`,
    [comment_id]
  );

  if (!rows.length) {
    return Promise.reject({ status: 404, msg: "Not found" });
  }
};

exports.deleteCommentById = async (comment_id) => {
  await db.query(
    `DELETE FROM comments
    WHERE comment_id = $1;`,
    [comment_id]
  );
};
