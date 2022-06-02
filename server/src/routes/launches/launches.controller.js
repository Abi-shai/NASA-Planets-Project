const launches = require('../../model/launches.model')


function httpgetAllLaunches(req, res){
    return res.status(200).json(launches.getAllLaunches())
}

module.exports = httpgetAllLaunches