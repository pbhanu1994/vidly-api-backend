const mongoose = require('mongoose');
const Joi = require('joi');

// Creating Schema for genre
const classSchema = new mongoose.Schema({
    class: {
        type: String,
        minlength: 3,
        maxlength: 50,
        trim: true
    }
})

// Compiling the schema to the Model
const Class = mongoose.model('Class', classSchema);

//Validate function
function validateClass(memberClass){
    const schema = {
        class: Joi.string().min(3).max(50).required()
    }
    return Joi.validate(memberClass, schema);
}

exports.Class = Class;
exports.classSchema = classSchema;
exports.validate = validateClass;