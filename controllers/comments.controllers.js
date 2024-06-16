const {
  deleteCommentById,
  checkCommentExists,
} = require("../models/comments.models");

exports.deleteComment = async (req, res, next) => {
  const { comment_id } = req.params;

  try {
    await checkCommentExists(comment_id);
    await deleteCommentById(comment_id);
    res.status(204).send({});
  } catch (err) {
    next(err);
  }
};
