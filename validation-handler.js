const { compare } = require('./util')

function handler(body){
  const { rule,  data } = body;

  const splitRule = rule.field.split('.');

  // If data is not an object, it can't have the specified key in the field object
  if(typeof(data) !== 'object' || data == null || (Array.isArray(data))){
    return {
      message: `field ${splitRule[0]} is missing from data.`,
      error: true
    }
  }

  // if the field value is not an object, not nested
  if(splitRule.length === 1 && data[splitRule[0]]){
    return validate(body)
  }

  // if the value is a nested object
  if(splitRule.length > 2){
    return {
      message: `Nesting is more than two levels`,
      error: true
    }
  }


  const outer = splitRule[0] ? data[splitRule[0]] : undefined;

  const inner = outer ? outer[splitRule[1]] : undefined;

  // check if the field is missing from the data
    if(!outer){
      return {
        message: `field ${splitRule[0]} is missing from data.`,
        error: true
      }
    }

    // check if the nested field is missing from data
    if(splitRule.length > 1 && !inner){
      return {
        message: `field ${splitRule[1]} is missing from data.`,
        error: true
      }
    }

    return validate(body, splitRule)
}


function validate(body, nested){
  const { rule, data } = body;

  let dataValue = data[rule.field];
  body.dataValue = dataValue;
  if(nested){
    const outer = nested[0];
    const inner = nested[1];
    dataValue = data[outer][inner];
    body.dataValue = dataValue;
  }

  if(rule.condition === 'eq'){
    body.error = compare(dataValue, rule.condition_value, rule.condition);
    return validationResponse(body)
  }

  if(rule.condition === 'neq'){
    body.error = compare(dataValue, rule.condition_value, rule.condition);
    return validationResponse(body)
  }

  if(rule.condition === 'gt'){
    body.error = compare(dataValue, rule.condition_value, rule.condition);
    return validationResponse(body)
  }

  if(rule.condition === 'gte'){
    body.error = compare(dataValue, rule.condition_value, rule.condition);
    return validationResponse(body)
  }

  if(rule.condition === 'contains'){
    body.error = compare(dataValue, rule.condition_value, rule.condition);
    return validationResponse(body)
  }


}

function validationResponse(body){

  const { rule, error, dataValue} = body;
  const message = !(error) ? `field ${rule.field} successfully validated.` : `field ${rule.field} failed validation.`
  return {
    "message": message,
    "error": error,
    "status": (error) ? 'error' : 'success',
    "data": {
      "validation": {
        "error": error,
        "field": rule.field,
        "field_value": dataValue,
        "condition": rule.condition,
        "condition_value": rule.condition_value
    }
  }
  }
}

function errorHandler(e){
  if(e.details[0].type === 'any.required'){
    return `${e.details[0].context.label} is required.`
  } 
  
  if(e.details[0].type === 'object.base'){
    return `${e.details[0].context.label} should be an object.`
  }
  
  if(e.details[0].type === 'string.base'){
    return `${e.details[0].context.label} should be a string.`
  }
  
  if(e.details[0].type === 'number.base'){
    return `${e.details[0].context.label} should be a number.`
  }

  if(e.details[0].type === 'alternatives.types'){
    const temp = e.details[0].context;
    return `${temp.label} should be a/an ${temp.types[0]} or ${temp.types[1]}.`
  }
  
  return e;
}

module.exports = {
  handler, errorHandler
}