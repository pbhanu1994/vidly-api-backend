const config = require('config');

module.exports = () => {
    // Exiting the program if the environment variable is not set
    if(!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
        // Note: Best Practice, use error object for Stack trace in the log file.

        // process.exit(0) -- is for successful operations
        // process.exit(1);
    }
}