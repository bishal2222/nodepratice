const Joi = require('joi');

const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    repeat_password: Joi.ref('password'),

    access_token: [
        Joi.string(),
        Joi.number()
    ],

    birth_year: Joi.number()
        .integer()
        .min(1900)
        .max(2013)
        .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})
 


schema.validate({ birth_year: 1994 });
// -> { value: { username: 'abc', birth_year: 1994 } }

schema.validate({});
// -> { value: {}, error: '"username" is required' }

// Also -
async function test(){
    try {
        const value = await schema.validateAsync({username:'test'});
        console.log(value)
    }
    catch (err) {
        console.log(err)
     }
}

test()

