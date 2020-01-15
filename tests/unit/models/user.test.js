const { User } = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

// Describing the test for user.generateAuth method
describe('user.generateAuthToken', () => {
    it('should return a valid JWT', () => {
        const userPayload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true 
        };
        const user = new User(userPayload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

        expect(decoded).toMatchObject(userPayload);
    });
});