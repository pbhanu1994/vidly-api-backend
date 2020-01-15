const request = require('supertest');
const mongoose = require('mongoose');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');

let server;

describe('/api/genres', () => {
    // Starting the server and closing it.. by importing the index
    beforeEach(() => { server = require('../../index') });
    afterEach(async () => {
        await server.close();
        // Removing the collection after expecting the result to be valid
        await Genre.remove({});
     });

    describe('GET /', () => {
        it('should return all the genres', async () => {
            // Populating the Test DB..
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);

            const res = await request(server).get('/api/genres');
            
            // Expecting the response to be 200 and length to be 2
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            // Expecting the name of the genre names
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    // Testing the Route Parameter
    describe('GET /:id', () => {
        it('should return the genre by given id', async () => {
            // Adding a Genre to the test DB..
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id);

            // Expecting the response to be 200 and length to be 1
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if invalid ID is given', async () => {
            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);
        });
        
        it('should return 404 if no genre found', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get(`/api/genres/${id}`);

            expect(res.status).toBe(404);
        });
    });

    // Testing the authorization
    describe('POST /', () => {
        let token;
        let name;
        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        });

        it('should send 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should send 400 if genre is less than 5 characters', async () => {
            name = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should send 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return genre if genre is valid', async () => {
            await exec();
            
            const genre = await Genre.find({ name: 'genre1' });

            expect(genre).not.toBeNull();
        });

        it('should return genre if genre is valid', async () => {
            const res = await exec();
            
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });

    describe('PUT /:id', () => {
        let token;
        let newName;
        let genre;
        let id;
        const exec = async () => {
            return await request(server)
                .put(`/api/genres/${id}`)
                .set('x-auth-token', token)
                .send({ name: newName });
        }

        beforeEach(async () => {
            genre = new Genre({ name: 'genre1' });
            await genre.save();

            token = new User().generateAuthToken();
            id = genre._id;
            newName = 'genre2';
        });
        
        it('should update the genre', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
        });
        
        it('should return the genre if genre is valid', async () => {
            await exec();

            const genre = await Genre.find({ name: 'genre2' })

            expect(genre).not.toBeNull();
        });
        
        it('should return the genre if genre is valid', async () => {
            await exec();

            const resGenre = await Genre.findById(genre._id);

            expect(resGenre.name).toBe(newName);
        });
        
        it('should return the genre if genre is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', newName);
        });

        it('should send 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should send 400 if genre is less than 5 characters', async () => {
            newName = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should send 400 if genre is more than 50 characters', async () => {
            newName = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 404 if no genre found with given ID', async () => {
            id = mongoose.Types.ObjectId();
            
            const res = await exec();

            expect(res.status).toBe(404);
        });
    });

    describe('DELETE /:id', () => {
        let id;
        let token;
        let genre;
        
        const exec = async () => {
            return await request(server)
                    .delete(`/api/genres/${id}`)
                    .set('x-auth-token', token)
                    .send();
        }

        beforeEach(async () => {
            genre = new Genre({ name: 'genre3' });
            await genre.save();

            token = new User({ isAdmin: true }).generateAuthToken();
            id = genre._id;
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });
        
        it('should return 403 if client is not an Admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(403);
        });
        
        it('should return 404 if genre with given id is not found', async () => {
            id = mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });
        
        it('should delete genre if input is valid', async () => {
            await exec();

            const resGenre = await Genre.findById(id);

            expect(resGenre).toBeNull();
        });
        
        it('should return the removed genre', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id', genre._id.toHexString());
            expect(res.body).toHaveProperty('name', 'genre3');
        });
    })
});