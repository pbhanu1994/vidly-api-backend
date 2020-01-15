const { Genre, validate } = require('../models/genre');
// const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectid');
const express = require('express');
const router = express.Router();

//Building Rest APIs for Genres
//Getting All Movie Genres
router.get('/', async (req, res) => {
    // throw new Error('Could not get the genres.');
    
    const genres = await Genre.find();
    if(!genres) return res.status(404).send(`No Genres found`);

    //Sending all genres to the client
    res.send(genres);
});

//Getting a specific movie by given id in body request
router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send(`No genre found with given id ${req.params.id}`);

    res.send(genre);
});

//Creating a new movie genre genre by given req body
router.post('/', auth, async (req, res) => {
    //Validate the new genre
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({ name: req.body.name })
    // Saving the new genre object by save method
    genre = await genre.save();

    res.send(genre);
});

//Updating an existing genre with given id & req body
router.put('/:id', auth, async (req, res) => {
    //validating the genre by Joi
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //checking if the genre is existing and updating
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { 
        new: true
    })

    if(!genre) return res.status(404).send(`No genre found with the given id ${req.params.id}`);
    
    res.send(genre);
});

//Deleting an existing genre with given id
router.delete('/:id', [auth, admin], async (req, res) => {
    //Checking if the Genre is existing and deleting
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if(!genre) return res.status(404).send(`No genre found to delete with given id ${req.param.id}`);

    res.send(genre);
});

module.exports = router;