const express = require('express');
const cors = require('cors');
// Importing the routes and middlewares
const auth = require('../routes/auth');
const users = require('../routes/users');
const genres = require('../routes/genres');
const memberClasses = require('../routes/classes');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const returns = require('../routes/returns');
const error = require('../middleware/error');

module.exports = app => {
    // Use the routes and middlewares
    app.use(express.json());
    app.options('*', cors())
    app.use('/api/auth', auth);
    app.use('/api/users', users);
    app.use('/api/genres', genres);
    app.use('/api/classes', memberClasses);
    app.use('/api/customers', customers);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/returns', returns);
    app.use(error);
}