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


function existLaunchWithId(launchId){
    return launches.has(launchId)
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
function abortLaunchById(launchId){
    const aborted = launches.get(launchId)
    aborted.upcoming = true
    aborted.success = false
    return aborted
}


// Handles the creation of new launch on the MongoDB Database
async function saveLaunch(launch) {
    const planet = planets.findOne({
        keplerName: launch.target,
    })

    if(!planet) {
        throw new Error('No matching planet was found')
    }

    await launches.updateOne({
        flightNumber: launch.flightNumber 
    }, launch, {
        upsert: true
    })
}

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existLaunchWithId,
    abortLaunchById
}
