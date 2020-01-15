const winston = require('winston');

module.exports = (err, req, res, next) => {
    // Logging the error in error level
    // winston.log('error', err.message);
    winston.error(err.message, err);
    // Logging Levels:
    // - error, warn, info, verbose, debug, silly

    // Logging the excepion
    res.status(500).send('Something failed.');
}