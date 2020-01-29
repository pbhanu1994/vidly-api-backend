const { Class, validate } = require('../models/class');
// const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectid');
const express = require('express');
const router = express.Router();

//Building Rest APIs for Member Classes
//Getting All Movie Member Classes
router.get('/', async (req, res) => {
    // throw new Error('Could not get the Member Classes.');
    
    const memberClasses = await Class.find();
    if(!memberClasses) return res.status(404).send(`No Classes found`);

    //Sending all Member Classes to the client
    res.send(memberClasses);
});

//Getting a specific movie by given id in body request
router.get('/:id', validateObjectId, async (req, res) => {
    const memberClass = await Class.findById(req.params.id);
    if(!memberClass) return res.status(404).send(`No Class found with given id ${req.params.id}`);

    res.send(memberClass);
});

//Creating a new Customer Class by given req body
router.post('/', auth, async (req, res) => {
    //Validate the new Member Class
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let memberClass = new Class({ name: req.body.name });
    // Saving the new Member Class object by save method
    memberClass = await memberClass.save();

    res.send(memberClass);
});

//Updating an existing Member Classes with given id & req body
router.put('/:id', auth, async (req, res) => {
    //validating the Member Class by Joi
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //checking if the Member Class is existing and updating
    const memberClass = await Class.findByIdAndUpdate(req.params.id, { name: req.body.name }, { 
        new: true
    });

    if(!memberClass) return res.status(404).send(`No Class found with the given id ${req.params.id}`);
    
    res.send(memberClass);
});

//Deleting an existing Member Class with given id
router.delete('/:id', [auth, admin], async (req, res) => {
    //Checking if the Member Class is existing and deleting
    const memberClass = await Class.findByIdAndDelete(req.params.id);
    if(!memberClass) return res.status(404).send(`No Class found to delete with given id ${req.param.id}`);

    res.send(memberClass);
});

module.exports = router;