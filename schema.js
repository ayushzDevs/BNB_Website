const joi = require('joi');

module.exports.listingschema = joi.object({
    listing : joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required(),
        location: joi.string().required(),
        country: joi.string().required().min(0),
        imageUrl: joi.string().allow("", null)
    }).required()
});