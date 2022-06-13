const http = require('http')

const app = require('./app')
const { mongooConnect } = require('./services/mongo')
const { loadPlanetsData } = require('./model/planets.model')

const PORT = process.env.PORT || 3000

const server = http.createServer(app)

async function startServer(){
    await mongooConnect()
    await loadPlanetsData()
    
    server.listen(PORT, () => {
        console.log(`Listening at port ${PORT}`)
    })
}

startServer()