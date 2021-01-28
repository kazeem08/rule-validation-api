module.exports = {
  // The function replies error as false if comparison passes, else true
  compare(a, b, sign){
      if(sign === 'eq'){
        return (a === b) ? false : true;
      }
    
      if(sign === 'neq'){
        return (a !== b) ? false : true;
      }
    
      if(sign === 'gt'){
        return (a > b) ? false : true;
      }
    
      if(sign === 'gte'){
        return (a >= b) ? false : true;
      }
    
      if(sign === 'contains'){
        return (a.includes(b)) ? false : true;
      }
  },

  
  
}