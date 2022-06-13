const mongoose = require('mongoose')

const MONGO_URL = "mongodb+srv://nasa-api:veX8byrFC6Kf18ae@nasa-cluster.lbwcb.mongodb.net/nasa?retryWrites=true&w=majority"

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!')
})

mongoose.connection.on('error', (err) => {
    console.log(err)
})

async function mongooConnect(){
    await mongoose.connect(MONGO_URL, {
        autoIndex: false
    })
}

async function mongooseDisconnect() {
    await mongoose.disconnect()
}

module.exports = {
    mongooConnect,
    mongooseDisconnect
}
