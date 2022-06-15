const http = require('http')

const app = require('./app')
const { mongooConnect } = require('./services/mongo')
const { loadPlanetsData } = require('./model/planets.model')
const { loadLaunchData } = require('./model/launches.model')

const PORT = process.env.PORT || 3000

const server = http.createServer(app)

async function startServer(){
    await mongooConnect()
    await loadPlanetsData()
    await loadLaunchData()
    
    server.listen(PORT, () => {
        console.log(`Listening at port ${PORT}`)
    })
}

startServer()