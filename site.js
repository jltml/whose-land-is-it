// const fetch = require('node-fetch')

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
  var crd = pos.coords;

  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);

  fetch(`https://geo.fcc.gov/api/census/block/find?latitude=${crd.latitude}&longitude=${crd.longitude}&format=json`)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      document.getElementById("location").innerHTML = `Your location: ${data["County"]["name"]} County, ${data["State"]["name"]}`
    })
    .catch((err) => {
      // Do something for an error here
    })

  fetch(`https://native-land.ca/api/index.php?maps=territories&position=${crd.latitude},${crd.longitude}`)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      // Work with JSON data here
      territoriesArray = []
      Object.keys(data).forEach(key => {
        territoriesArray[key] = data[key]["properties"]["Name"]
      } );

      if (territoriesArray.length == 0) {
        var territoriesString = "Oops, something went wrong! Perhaps you're outside of an area covered by <a href=\"https://native-land.ca\">native-land.ca</a>"
      } else if (territoriesArray.length == 1) {
        var territoriesString = `You are on ${territoriesArray} land.`
      } else if (territoriesArray.length == 2) {
        var territoriesString = `You are on ${territoriesArray[0]} and ${territoriesArray[1]} land.`
      } else if (territoriesArray.length > 2) {
        var territoriesString = `You are on ${territoriesArray.slice(0, -1).join(", ")}, and ${territoriesArray[territoriesArray.length - 1]} land.`
      }
    document.getElementById("territories").innerHTML = territoriesString
    document.getElementById("territories-map").innerHTML = `<iframe src=\"https://native-land.ca/api/embed/embed.html?maps=territories&position=${crd.latitude},${crd.longitude}\"></iframe>`
    })
    .catch((err) => {
      // Do something for an error here
    })


}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  document.getElementById("territories").innerHTML = `Hmm, looks like something went wrong with your location. Here's the error message: "${err.message}"`;
}

navigator.geolocation.getCurrentPosition(success, error, options);
