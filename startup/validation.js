const Joi = require('joi');

module.exports = () => {
    // For validating objectIDs in Joi, instead of mongoose.Types.ObjectId.isValid()
    Joi.objectId = require('joi-objectid')(Joi);
}