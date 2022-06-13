const request = require('supertest')

const app = require('../../app.js')
const { mongooConnect, mongooseDisconnect } = require('../../services/mongo')

describe('Launches API', () => {
    beforeAll(async () => {
        await mongooConnect()
    })

    afterAll(async () => {
        await mongooseDisconnect()
    })

    describe('Test GET /launches', () => {
        test('It should respond with a 200 success status code', async () => {
            const response = await request(app)
                .get('/launches')
                .expect('Content-type', /json/)
                .expect(200)
        })
    })
    
    describe('Test POST /launch', () => {
    
        const completeLaunchData = {
            mission: 'USS Entreprise',
            rocket: 'NCC-10002-0025',
            target: 'Kepler-62 f',
            launchDate: 'January 4, 2023'
        }
    
        const launchDataWithoutTheData = {
            mission: 'USS Entreprise',
            rocket: 'NCC-10002-0025',
            target: 'Kepler-62 f',
        }
    
        const launchDataWithInvalidDate = {
            mission: 'USS Entreprise',
            rocket: 'NCC-10002-0025',
            target: 'Kepler-62 f',
            launchDate: 'Zut'
        }
    
        test('It should respond with a 201 success status code', async () => {
            const response = await request(app)
                .post('/launches')
                .send(completeLaunchData)
                .expect('Content-type', /json/)
                .expect(201)
    
        const requestDate = new Date(completeLaunchData.launchDate).valueOf()
        const responseDate = new Date(response.body.launchDate).valueOf()
        
        expect(responseDate).toBe(requestDate)
    
        expect(response.body).toMatchObject(launchDataWithoutTheData)
    
        })
        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post('/launches')
                .send(launchDataWithoutTheData)
                .expect('Content-type', /json/)
                .expect(400)
            expect(response.body).toStrictEqual({
                error: 'Missing required launch data'
            })
        })
    
        test('It should catch invalid date', async() => {
            const response = await request(app)
                .post('/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-type', /json/)
                .expect(400)
            expect(response.body).toStrictEqual({
                error: 'Invalid launch Date'
            })
        })
    })
})