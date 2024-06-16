const db = require("../db/connection");
const fs = require("fs/promises");

exports.selectEndpoints = async () => {
  const data = await fs.readFile(
    "/Users/darina/Documents/Northcoders/be-nc-news/endpoints.json",
    "utf-8"
  );
  return JSON.parse(data);
};
