const http = require('http')
const mongoose = require('mongoose')
const app = require('./app')

const { loadPlanetsData } = require('./model/planets.model')

const PORT = process.env.PORT || 3000

const MONGO_URL = "mongodb+srv://nasa-api:veX8byrFC6Kf18ae@nasa-cluster.lbwcb.mongodb.net/nasa?retryWrites=true&w=majority"

const server = http.createServer(app)

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!')
})

async function startServer(){
    await mongoose.connect(MONGO_URL, {
        autoIndex: false
    })
    await loadPlanetsData()
    server.listen(PORT, () => {
        console.log(`Listening at port ${PORT}`)
    })
}

startServer()