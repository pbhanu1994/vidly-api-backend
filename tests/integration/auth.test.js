const request = require('supertest');
const { User } = require('../../models/user');
const { Genre } = require('../../models/genre');

let server;
describe('auth middleware', () => {
    beforeEach(() => { server = require('../../index') });
    afterEach(async () => {
        await server.close();
        // Removing the collection after expecting the result to be valid
        await Genre.remove({});
     });

    let token;
    let name;
    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });
    }

    beforeEach(() => {
        token = new User().generateAuthToken();
    });

    it('should return 401 if the token is not provided', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if the token is not valid', async () => {
        token = 'a';

        const res = await exec();

        expect(res.status).toBe(400);
    });
    
    it('should return 200 if the token is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });
})