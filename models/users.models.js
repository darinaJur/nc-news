const db = require("../db/connection");

exports.selectUsers = async () => {
  const { rows } = await db.query(`SELECT * from users;`);
  return rows;
};

exports.selectUserByUsername = async (username) => {
  const { rows } = await db.query(
    `
    SELECT * FROM users
    WHERE username = $1;`,
    [username]
    );
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "User not found" });
  } else {
    return rows[0];
  }
};
