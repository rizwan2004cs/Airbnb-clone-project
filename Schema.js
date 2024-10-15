const Joi = require('joi');
const ListingSchema = Joi.object({
    title:Joi.string().required(),
    description:Joi.string().required(),
    location:Joi.string().required(),
    country:Joi.string().required(),
    price:Joi.number().required().min(0),
    image: Joi.string().allow("",null),
    
})

    


const ReviewSchema = Joi.object({
    review :Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
        createdAt:Joi.date()
    }).required(),
})

module.exports = { ListingSchema, ReviewSchema };
