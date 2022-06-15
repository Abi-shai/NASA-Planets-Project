const axios = require('axios')

const launches = require('./launches.mongo')
const planets = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100

let latestFlightNumber = 100

// Base state of all the proporties that goes with Launches
const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchData: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
}

// Handles saving a launch to a MongoDB Database
saveLaunch(launch)


async function loadLaunchesData() {
    const SPACEX_URL = 'https://api.spacexdata.com/v4/launches/query'

    console.log('Loading the launches data')
    const response = await axios.post(SPACEX_URL, {
        query: {},
        options: {
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
}


async function existLaunchWithId(launchId){
    return await launches.findOne({
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
async function getAllLaunches(){
    return await launches
        .find({}, { '_id': 0, '__v': 0 })
}


// Handles the creation of a new launch on the MongoDB Database
// also increment the number of flights to track the latest flight number
async function scheduleNewLaunch(launch){
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
    const planet = planets.findOne({
        keplerName: launch.target,
    })

    if(!planet) {
        throw new Error('No matching planet was found')
    }

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
