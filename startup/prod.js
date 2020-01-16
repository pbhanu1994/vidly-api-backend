const helmet = require('helmet'); //Protect from well known web vulnerabilities
const compression = require('compression'); //Compress the response that we send to client
const cors = require('cors');

module.exports = (app) => {
    app.use(helmet());
    app.use(compression());
    app.use(cors());
}