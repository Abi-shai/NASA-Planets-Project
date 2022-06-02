const http = require('http')
const app = require('./app')

const { loadPlanetsData, planets } = require('./model/planets.model')

const PORT = process.env.PORT || 8000

const server = http.createServer(app)

async function startServer(){
    server.listen(PORT, () => {
        console.log(`Listening at port ${PORT}`)
    })
}

startServer()