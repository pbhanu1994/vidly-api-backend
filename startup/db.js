const mongoose = require('mongoose');
const winstion = require('winston');
const config = require('config');

module.exports = () => {
    const db = config.get('db');
    // Connecting to Vidly DB...
    mongoose.connect(db)
        .then(() => winstion.info(`Connected Successfully to ${db}...`));
}