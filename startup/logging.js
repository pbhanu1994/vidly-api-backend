const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors');

module.exports = () => {
    // OUTSIDE THE CONTEXT OF EXPRESS
    // Uncaught Exceptions - Outside the context of express.. (Catching the exceptions here)
    //  - This approach only works for Synchronous Code - NOT FOR PROMISES
    // process.on('uncaughtException', ex => {
    //     console.log('WE GOT AN UNCAUGHT EXCEPTION');
    //     winston.error(ex.message, ex);
    //     process.exit(1);
    // });
        
    // Unhandled Promise Rejections - Outside the context of express.. (Catching the exceptions here)
    // - This approach works for the asynchronous code - FOR PROMISES
    // process.on('unhandledRejection', ex => {
    //     console.log('WE GOT AN UNHANDLED PROMISE REJECTION');
    //     winston.error(ex.message, ex);
    //     process.exit(1);
    // });

    // WINSTON - Uncaught Exceptions
    winston.handleExceptions(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'uncaughtExceptions.log'})
    );

    // Throwing Unhandled promise rejection for Winston (handleExceptions)
    process.on('unhandledRejection', ex => {
        throw ex;
    });

    // Adding the winston to log messages in the File Transport
    // - Winston has 3 transports - Console, File, and HTTP and MongoDB via package (winston-mongodb).
    winston.add(winston.transports.File, { filename: 'logfile.log' });
    // Adding the winston to log messages in the Mongo DB.
    // winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/vidly' }); (or)
    // winston.add(winston.transports.MongoDB, { 
    //     db: 'mongodb://localhost/vidly',
    //     level: 'error' //Only get the error messages
    //     // level: 'info' // info is the 3rd level, so the error, warn and info messages will be logged
    // });

    // Notes: For querying the files, use MongoDB Transport, incase of MongoDB shutdown
    //  - use File Transport - since it's always available.
    // - It's good to use both the Transports

    // Examples for Uncaught Exceptions - Outside the context of Express
    // Throwing Exception Synchronously - For Normal unhandled exception
    // throw new Error('Something failed during startup.');

    // Throwing Exception Asynchronously (Via Promise) - For Normal unhandled exception
    // const p = Promise.reject(new Error('Something failed miserably'));
    // p.then(() => console.log('Done'));
}