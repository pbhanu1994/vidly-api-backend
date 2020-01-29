const mongoose = require('mongoose');
const Joi = require('joi');
const { classSchema } = require('../models/class');

//Creating a Schema for the customer and compiling - 
    // - the schema to the model
const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        trim: true
    },
    class: {
        type: classSchema,
        required: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
}));

//Validating the customer with Joi
function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        classId: Joi.objectId().required(),
        phone: Joi.string().min(5).max(50).required()
    }
    return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;