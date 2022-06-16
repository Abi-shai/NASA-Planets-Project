const axios = require('axios')

const launches = require('./launches.mongo')
const planets = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100

// Handles saving a launch to a MongoDB Database
saveLaunch(launch)

const SPACEX_URL = 'https://api.spacexdata.com/v4/launches/query'

async function populateLaunches() {
    console.log('Loading the launches data')
    const response = await axios.post(SPACEX_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: "rocket",
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    })

    if(response.status !== 200) {
        console.error('Problem loading launch data')

        throw new Error('Launch data download failed')
    }

    const launchDocs = response.data.docs

    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads']
        const customers = payloads.flatMap((payload) => {
            return payload['customers']
        })

        const launch = {
            flightNumber: launchDoc.flight_number,
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchData: launchDoc['data_local'],
            upcoming: launchDoc['upcoming'],
            succes: launchDoc['success'],
            customers
        }

        console.log(`${launch.flightNumber} ${launch.mission}`)

        await saveLaunch(launch)
    }
}

async function loadLaunchesData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    })
    await populateLaunches()
}


async function findLaunch(filter) {
    return await launches.findOne(filter)
}


async function existLaunchWithId(launchId){
    return await findLaunch({
        flightNumber: launchId
    })
}


// Handles returning the latest flight number from the array of launches
// from the MongoDB Database
async function getLatestFlightNumber(){
    const latestLaunch = await launches
        .findOne()
        // Added the minus sign to return the latestLaunch
        // in descending order
        .sort(`-flightNumber`)

    if(!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER
    }

    return latestLaunch.flightNumber
}

// Handles returning all the launches on the MongoDB Database
async function getAllLaunches(skip, limit){
    return await launches
        .find({}, { '_id': 0, '__v': 0 })
        .sort({ flightNumber: 1 })
        .skip(skip)
        .limit(limit)
}


// Handles the creation of a new launch on the MongoDB Database
// also increment the number of flights to track the latest flight number
async function scheduleNewLaunch(launch){
    const planet = planets.findOne({
        keplerName: launch.target,
    })
    if(!planet) {
        throw new Error('No matching planet was found')
    }

    const newFlightNumber = await getLatestFlightNumber() + 1

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Zero to mastery', 'NASA'],
        flightNumber: newFlightNumber,
    })

    await saveLaunch(newLaunch)
}


// Handles aborting a launch that exist on the MongoDB Database
async function abortLaunchById(launchId){
    const aborted = await launches.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    })

    return aborted.modifiedCount === 1
}


// Handles the creation of new launch on the MongoDB Database
async function saveLaunch(launch) {
    // The upsert boolean parameter checks if the launch
    // already exists in the database collection
    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber 
    }, launch, {
        upsert: true
    })
}

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existLaunchWithId,
    abortLaunchById,
    loadLaunchesData
}
