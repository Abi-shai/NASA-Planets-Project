const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse')
const planets = require('./planets.mongo')


// Handles checking processes conditions for habitable planets
const isPlanetHabitable = (planet) => {
    return planet['koi_disposition'] === 'CONFIRMED' 
        && planet['koi_insol'] > .36 && planet['koi_insol'] < 1.11 
        && planet['koi_prad'] < 1.6
}

async function savePlanets(planet){
    try{
        await planets.updateOne({
            keplerName: planet.kepler_name,
        }, {
            keplerName: planet.kepler_name
        }, {
            upsert: true
        })
    } catch(err){
        console.error(`Couldn't save a planet ${err}`)
    }
}

// Handles the returning data in rows of the planets data
function loadPlanetsData(){
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '../', '../', '/data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', async (data) => {

                if(isPlanetHabitable(data)){
                    // Upsert the creation of planet
                    // only if it doesn't exit in the database
                    savePlanets(data)
                }

            })
            .on('error', (error) => {
                console.log(error)
                reject(error)
            })
            .on('end', async () => {
                const countPlanetsFound = (await getAllPlanets()).length
                console.log(`${countPlanetsFound} is the number of habitable planets found`)
            })
            resolve()
            console.log(habitablePlanet)
        })
}

async function getAllPlanets(){
    return await planets.find({})
}


module.exports = {
    getAllPlanets,
    loadPlanetsData
}