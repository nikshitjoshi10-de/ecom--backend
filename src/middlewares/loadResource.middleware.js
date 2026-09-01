const apiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const loadResource = (Model, param = 'id', field = '_id') =>
  asyncHandler(async (req, _res, next) => {
    const value = req.params[param];

    const doc =
      field === '_id'
        ? await Model.findById(value)
        : await Model.findOne({ [field]: value });

    if (!doc) throw apiError(404, `${Model.modelName} not found`);

    req.resource = doc;
    next();
  });

module.exports = loadResource;