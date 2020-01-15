const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { Movie } = require('../models/movie');
const { Rental } = require('../models/rental');
const express = require('express');
const router = express.Router();
const Joi = require('joi');

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if(!rental) return res.status(404).send('No rental found with given CustomerId/MovieID');
    
    if(rental.dateReturned) return res.status(400).send('Return has already been processed');

    rental.return();
    await rental.save();

    await Movie.update({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    });

    // No need to add 200, express will set it by default
    return res.send(rental);
});

function validateReturn(req) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }
    return Joi.validate(req, schema);
}

module.exports = router;