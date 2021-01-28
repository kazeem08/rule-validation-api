const Joi = require('joi');

module.exports = {
  schema : Joi.object({
    rule: Joi.object({field: Joi.string().required(), condition: Joi.string().required(), condition_value: Joi.required()}).required(),
    
    data: Joi.required(),
  
  })
}