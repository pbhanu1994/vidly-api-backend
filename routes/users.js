const { User, validate } = require('../models/user');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

// API for getting the User details by getting JWT from header
// - Don't user /:id -> Some users may have sensitive info that others should not see
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if(!user) return res.status(404).send('No User found with given token');

    res.send(user);
})

// API for Creating the new User and saving to the user colleciton in DB
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send('User already registered.');
    
    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    // Generating Salt and Hashing the Password by combining Salt (before / after) to it
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    
    await user.save();

    // Getting JSON Web Token (JWT) after successful authentication
    // const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));

    // Get the Auth token from the user object, this way getting of Token is not repeated
    const token = user.generateAuthToken();

    // Sendint the token in the header, and other properties in normal response
    res
        .header('x-auth-token', token)
        .header("access-control-expose-headers", "x-auth-token")
        // .header("access-control-allow-origin", "https://cryptic-reaches-36892.herokuapp.com")
        .send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;