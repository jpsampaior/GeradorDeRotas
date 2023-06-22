var departureAddress;
var destinationAddress;

const btnGenerateRoutes = document.querySelector("#btnGenerateRoutes");

class Address {
    constructor(textAddress,latitude,longitude) {
        this.textAddress = textAddress;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    getTextAddress() {
        return this.textAddress;
    }

    getLatitude() {
        return this.latitude;
    }

    getLongitude() {
        return this.longitude;
    }
}

function initMap() {
    var options = {
        zoom:2,
        center: { lat: 40.781369, lng: -73.966315 }
    }

    var map = new
    google.maps.Map(document.getElementById('map'), options);
}

function generateCoordinates(inputAddress) {
  const address = inputAddress;
  const apiKey = "AIzaSyCMekkkZ9oy-zoKC5WUQq6ws2d6pQV9Yk4";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;

  fetch(url)
  .then(response => response.json())
  .then(data => {
    if (data.status === 'OK') {
      const latitude = data.results[0].geometry.location.lat;
      const longitude = data.results[0].geometry.location.lng;
      console.log(`Latitude: ${latitude}`);
      console.log(`Longitude: ${longitude}`);

      return new Address(address,latitude,longitude);
    }
  })
  .catch(error => {
    console.error("Ocorreu um erro ao obter as coordenadas:", error);
  });

  
}

btnGenerateRoutes.addEventListener("click",function(e) {
    e.preventDefault();

    departureAddress = generateCoordinates(document.querySelector("#ipDepartureAdress").value);
    destinationAddress = generateCoordinates(document.querySelector("#ipDestinationAdress").value);
});