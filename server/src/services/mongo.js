const mongoose = require('mongoose')

const MONGO_URL = process.env.MONGO_URL

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
