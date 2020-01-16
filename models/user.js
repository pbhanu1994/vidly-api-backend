const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Writing the Schema for User Model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: Boolean
    // roles: [/* Complex Objects */],
    // operations: [/* Complex Objects */] 
});

// Encapsulating Logic for getting Auth Token (JWT) from User Object
// - This way generateAuthToken method don't have to be in separate module 
// - (where it will end up many functions in application haniging in many modules)
userSchema.methods.generateAuthToken = function() {
    // Getting JSON Web Token (JWT) after successful authentication
    const token = jwt.sign({ _id: this._id, name: this.name, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}

// Schema for Users
const User = mongoose.model('User', userSchema);

// Validating the Request
function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required()
    }
    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;