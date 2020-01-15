const { Customer, validate } = require('../models/customer');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

//Building Routes for Customers
//Getting all the customers
router.get('/',async (req, res) => {
    const customers = await Customer.find().sort('name');
    if(!customers) return res.status(404).send('No Customers found');

    res.send(customers);
});

// Getting the specific customer with given ID
router.get('/:id',async (req, res) => {
    //Find the required customer for id
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send(`No Customers found with given ID ${req.param.id}`);
    
    res.send(customer);
});

//Posting the customer to the collection
router.post('/', auth, async (req, res) => {
    //Validating the body
    const { error }  = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    // Creating the customer object
    let customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    })
    
    // Saving to the db
    customer = await customer.save();
    
    res.send(customer);
});

router.put('/:id', auth, async (req, res) => {
    //Validating the body
    const { error }  = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    //Finding and updating the customer with given id
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    }, {
        new: true
    });
    
    if(!customer) return res.status(404).send(`No Customer found with given ID ${req.param.id}`);

    res.send(customer);
});

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if(!customer) return res.status(404).send(`No Customer found with given ID ${req.params.id}`);

    res.send(customer);
});

module.exports = router;