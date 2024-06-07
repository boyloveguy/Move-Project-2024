const { UNPROCESSABLE_ENTITY } = require("../core/error.response");
const { deleteImageFromCloudinary } = require("../utils/deleteFromCloudinary");

const validate = (schema, location = "body") => {
  return (req, res, next) => {
    const data =
      location === "body"
        ? req.body
        : location === "params"
        ? req.params
        : req.query;
    const { error, value } = schema.validate(data);
    if (error) {
      if (req.file) {
        deleteImageFromCloudinary(req.file.path);
      }

      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      throw new UNPROCESSABLE_ENTITY(errorMessage);
    }

    req.validatedData = value;

    next();
  };
};

module.exports = validate;
