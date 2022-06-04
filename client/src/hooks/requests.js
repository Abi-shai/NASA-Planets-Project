const API_URL ='http://localhost:8000'

async function httpGetPlanets() {
  // TODO: Once API is ready.
  // Load planets and return as JSON.

  const getPlanets = await fetch(`${API_URL}/planets`)
  return await getPlanets.json()
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
  const getLaunches = await fetch(`${API_URL}/launches`)
  const fetchedLaunchesData = await getLaunches.json()

  return fetchedLaunchesData.sort((a, b) => {
    return a.flightNumber - b.flightNumber
  })
}

async function httpSubmitLaunch(launch) {
  try{
    return await fetch(`${API_URL}/launches`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(launch),
    })
  } catch(error){
      return {
        ok: false
      }
  }
}

async function httpAbortLaunch(id) {
  try{
    return await fetch(`${API_URL}/launches/${id}`, {
      method: 'DELETE',
    })
  } catch(error){
      console.log(error)
      return {
        ok: false
      }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};