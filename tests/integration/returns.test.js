const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie');
const mongoose = require('mongoose');
const request = require('supertest');
const moment = require('moment');

describe('/api/returns', () => {
    let server;
    let token;
    let movie;
    let rental;
    let customerId;
    let movieId;
    
    const exec = () => {
        return request(server)
                .post('/api/returns')
                .set('x-auth-token', token)
                .send({ customerId, movieId });
    }

    beforeEach(async () => {
        server = require('../../index');

        token = new User().generateAuthToken();
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();

        movie = new Movie({
            _id: movieId,
            title: '12345',
            genre: {
                name: '12345'
            },
            numberInStock: 10,
            dailyRentalRate: 2
        });
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '1234'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        })
        await rental.save();
    });
    afterEach(async () => {
        await server.close();
        await Rental.remove({});
        await Movie.remove({});
    });

    it('should return 401 when client is not logged in!', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async () => {
        customerId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided', async () => {
        movieId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });
    
    it('should return 404 if no rental found with given customerId/movidId', async () => {
        await Rental.remove({});
        
        const res = await exec();

        expect(res.status).toBe(404);
    });
    
    it('should return 400 if rental already processed', async () => {
        rental.dateReturned = new Date();
        await rental.save();

        const res = await exec();

        expect(res.status).toBe(400);
    });
    
    it('should return 200 if is is a valid request', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });
    
    it('should set the return date if input is valid', async () => {
        await exec();

        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;

        expect(diff).toBeLessThan(10 * 1000);
    });
    
    it('should set the rental fee if input is valid', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        rental.save();

        await exec();

        const rentalInDb = await Rental.findById(rental._id);

        expect(rentalInDb.rentalFee).toBe(14);
    });
    
    it('should increase the movie stock if input is valid', async () => {
        await exec();

        const movieInDb = await Movie.findById(movie._id);

        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });
    
    it('should return rental if input is valid', async () => {
        const res = await exec();

        await Rental.findById(rental._id);

        // Comparing two arrays...
        expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
            'dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie'
        ]));
    });
});