const http = require('http')

require('dotenv').config()

const app = require('./app')
const { mongooConnect } = require('./services/mongo')
const { loadPlanetsData } = require('./model/planets.model')
const { loadLaunchesData } = require('./model/launches.model')

const PORT = process.env.PORT || 5000

const server = http.createServer(app)

async function startServer(){
    await mongooConnect()
    await loadPlanetsData()
    await loadLaunchesData()
    
    server.listen(PORT, () => {
        console.log(`Listening at port ${PORT}`)
    })
}

startServer()