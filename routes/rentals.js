const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const auth = require('../middleware/auth');
const Fawn = require('fawn');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Initializing Fawn here for 2 phase commits...
Fawn.init(mongoose);

// API for getting all the rentals
router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    if(!rentals) return res.status(404).send('No rentals found');

    res.send(rentals);
});

// API for getting the rental by given ID
router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if(!rental) return res.status(400).send(`No rental found with given ID ${req.params.id}`);

    res.send(rental);
});

// API for creating a new rental and saving to the collection in DB
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Checking if the customer ID is valid Object ID
    // if(!mongoose.Types.ObjectId.isValid(req.body.customerId))
    //     return res.status(400).send('Something went wrong.');
    
    // Getting the Customer Object
    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send(`No customer found with given Customer ID ${req.body.customerId}`);

    // Getting the Movie Object
    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send(`No movie found with given Movie ID ${req.body.movieId}`);

    if(movie.numberInStock === 0) return res.status(400).send('Movie not in Stock');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
    });

    // 2 places are getting updated, 2 Phase commit is happening..
    // rental = await rental.save();

    // movie.numberInStock--;
    // movie.save();

    // Fawn is a npm package which deals with Transaciton, unlike relational db's -
        // - here it uses 2 Phase commit technique internally
    // Using Fawn for 2 Phase Commit - Saving 'Rentals', and Updating 'Movies'
    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 } // Using increment operator for Increment / Decrement
            })
            // For removing a document
            // .remove()
            .run()
    
        res.send(rental);
    }
    catch(ex) {
        res.status(500).send('Something failed.');
    }
});

module.exports = router;