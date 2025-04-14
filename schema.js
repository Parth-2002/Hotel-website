const Joi = require('joi');
const review = require("./models/review");

module.exports.listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        price:Joi.number().required(),
        country:Joi.string().required(),
        image: Joi.alternatives().try(
            Joi.object({
                url: Joi.string().required(),
                filename: Joi.string().optional()
            }),
            Joi.allow(null)
        )
        
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});
