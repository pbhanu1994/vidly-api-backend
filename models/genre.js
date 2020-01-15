const mongoose = require('mongoose');
const Joi = require('joi');

// Creating Schema for genre
const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 50,
        trim: true
    }
})

// Compiling the schema to the Model
const Genre = mongoose.model('Genre', genreSchema);

//Validate function
function validateGenre(genre){
    const schema = {
        name: Joi.string().min(5).max(50).required()
    }
    return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = validateGenre;