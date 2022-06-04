const request = require('supertest')
const app = require('../../app.js')

describe('Test GET /launches', () => {
    test('It should respond with a 200 success status code', () => {
        const response = request(app)
        expect(response).toBe(200)
    })
})

describe('Test POST /launch', () => {
    test('It should respond with a 200 success status code', () => {

    })
    test('It should catch missing required properties', () => {})
    test('It should catch invalid date', () => {})
})