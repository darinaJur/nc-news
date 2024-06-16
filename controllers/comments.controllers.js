const {
  deleteCommentById,
  checkCommentExists,
  changeCommentVotes
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

exports.patchCommentVotes = async (req, res, next) => {
  const { comment_id } = req.params;
  const commentVoteValue = req.body.inc_votes;

  try {
      const comment = await changeCommentVotes(commentVoteValue, comment_id)
      res.status(200).send({ comment });
  } catch (err) {
    next(err)
  }
}
