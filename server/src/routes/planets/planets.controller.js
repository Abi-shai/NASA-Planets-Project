const { getAllPlanets } = require('../../model/planets.model')


async function httpGetAllPlanets(req, res){
    return  await res.status(200).json(getAllPlanets)
}


module.exports = {
    httpGetAllPlanets
}