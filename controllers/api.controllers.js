const { selectEndpoints } = require("../models/api.models")
const endpointData = require("../endpoints.json")

exports.getEndpoints = (req, res, next) => {
    return res.status(200).send({ endpointData })
}
