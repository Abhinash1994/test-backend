import BaseJoi from 'joi';
import DateExtension from 'joi-date-extensions';
const Joi = BaseJoi.extend(DateExtension);

export var validateBody = (schema) => {
    return (req, res, next) => {
        const result = req.method != 'GET' ? Joi.validate(req.body, schema) : Joi.validate(req.query, schema);
        if (result.error) {
            return res.status(400).json(result.error);
        }

        if (!req.value) { req.value = {}; }
        req.value['body'] = result.value;
        next();
    }
}

export var schemas = {
    registerSchema: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
    // addClient: Joi.object().keys({
    //     code: Joi.string().required(),
    //     name: Joi.string().required(),
    //     url:  Joi.string().required(),
    //     logo: Joi.string().required(),
    //     issas:Joi.string().required()
    // }),
    loginSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
    userCheckSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        
    }),
    resetPassword: Joi.object().keys({
        email: Joi.string().email().required(),
        verificationCode: Joi.string().required(),
        password: Joi.string().required()
    }),
    sendResetPassword: Joi.object().keys({
        email: Joi.string().email().required(),
    }),
    changePassword: Joi.object().keys({
       newPass: Joi.string().required(),
       oldPass: Joi.string().required(),
       confirmPass: Joi.string().required(),
        email: Joi.string().required(),
    }),
}