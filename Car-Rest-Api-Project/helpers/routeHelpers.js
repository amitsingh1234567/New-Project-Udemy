const Joi = require('joi');

module.exports = {
    validateParam: (schema, name) => {
        return (req, res, next) => {
                // const result = Joi.validate({param: req['params'][name]}, schema)
                //My writen code
                const result = Joi.validate({param: req.params[name]}, schema)
                              
                if(result.error){
                return res.status(400).json(result.error)  
                }else{
                if(!req.value)
                req.value = {};

                // if(!req.value['params'])
                // req.value['params'] = {};
                //My writen code
                if(!req.value.params)
                req.value.params = {};  
               
                // req.value['params'][name] = result.value.param;
                //My writen code
                req.value.params[name] = result.value.param 
                next()
               
           }
        }      
    },

    validateBody: (schema) => {
        return (reqq2, res, next) => {
            
        const result = Joi.validate(reqq2.body, schema) 
       
        if(result.error){
            return res.status(400).json(result.error)
        }else{
             if(!reqq2.value)
                reqq2.value = {};
            
            if(!reqq2.value['body'])
                reqq2.value['body'] = {};
                reqq2.value['body'] = result.value;
                next();
        }
        }
    },


    schemas:{
        userSchema:Joi.object().keys({
            firstName: Joi.string().required(),
            lastName:Joi.string().required(),
            email:Joi.string().email().required()
        }),
        userOptionalSchema: Joi.object().keys({
            firstName: Joi.string(),
            lastName:Joi.string(),
            email:Joi.string().email()
        }),
       userCarSchema: Joi.object().keys({
            make: Joi.string().required(),
            model:Joi.string().required(),
            year:Joi.number().required()
        }),
        carSchema: Joi.object().keys({
            seller: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            make: Joi.string().required(),
            model:Joi.string().required(),
            year:Joi.number().required()
        }),
        putcarSchema: Joi.object().keys({
            make: Joi.string().required(),
            model:Joi.string().required(),
            year:Joi.number().required()
        }),
        patchCarSchema: Joi.object().keys({
            make: Joi.string(),
            model:Joi.string(),
            year:Joi.number()
        }),
        idSchema:Joi.object().keys({
            param:Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        })
    }

}