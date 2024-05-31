const { deleteCommentById, checkCommentExists } = require("../models/comments.models")

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params

    const promises = [checkCommentExists(comment_id), deleteCommentById(comment_id)]

    Promise.all(promises)
    .then(() => {
        res.status(204).send({})
    })
    .catch(next)
}