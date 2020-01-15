const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

// API for Creating the new User and saving to the user colleciton in DB
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Invalid email or password.');
    
    // Authenticate with bcrypt compare method
    // Takes the salt from previous hash password, and re-hash the plain text password (req.body.password) 
    // - if they are equal, it will return true
    const validatePassword = await bcrypt.compare(req.body.password, user.password);
    if(!validatePassword) return res.status(400).send('Invalid email or password.');

    // // Getting JSON Web Token (JWT) after successful authentication
    // const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));

    // Get the Auth token from the user object, this way getting of Token is not repeated
    const token = user.generateAuthToken();

    // Returning the JWT Token to the user
    res.send(token);
});

// Validating the Request
function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required()
    }
    return Joi.validate(req, schema);
}

module.exports = router;