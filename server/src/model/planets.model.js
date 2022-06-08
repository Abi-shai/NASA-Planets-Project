const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse')
const planet = require('./planets.mongo')

const habitablePlanet = []

// Handles checking processes conditions for habitable planets
const isPlanetHabitable = (planet) => {
    return planet['koi_disposition'] === 'CONFIRMED' 
        && planet['koi_insol'] > .36 && planet['koi_insol'] < 1.11 
        && planet['koi_prad'] < 1.6
}

// Handles the returning data in rows of the planets data
function loadPlanetsData(){
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '../', '../', '/data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', (data) => {
                if(isPlanetHabitable(data)){
                    habitablePlanet.push(data)
                }
            })
            .on('error', (error) => {
                console.log(error)
                reject(error)
            })
            .on('end', () => {
                console.log(`${habitablePlanet.length} is the number of habitable planets found`)
            })
            resolve()
            console.log(habitablePlanet)
        })
}

function getAllPlanets(){
    return habitablePlanet
}

module.exports = {
    getAllPlanets,
    loadPlanetsData
}