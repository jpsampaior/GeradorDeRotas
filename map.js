const ipDepartureAddress = document.querySelector("#ipDepartureAdress");
const ipDestinationAddress = document.querySelector("#ipDestinationAdress");
const btnGenerateRoutes = document.querySelector("#btnGenerateRoute");
const btnDownloadInstructions = document.querySelector("#btnDownloadInstructions");
const instructionsBox = document.querySelector("#instructionsBox");

var departureAddress;
var destinationAddress;

var directionsService;
var directionsRenderer;

var csvString;
var instructionsItens;


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

class Request {
  constructor(departurePoint,destinationPoint) {
    this.origin = departurePoint;
    this.destination = destinationPoint;
    this.travelMode = google.maps.TravelMode.DRIVING;
  }
}

function initMap() {
  var options = {
    zoom:2,
    center: { lat: 40.781369, lng: -73.966315 }
  }

  var map = new
  google.maps.Map(document.getElementById('map'), options);

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
  });
}

async function generateCoordinates(inputAddress) {
  const address = inputAddress;
  const apiKey = "AIzaSyCMekkkZ9oy-zoKC5WUQq6ws2d6pQV9Yk4";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const latitude = data.results[0].geometry.location.lat;
      const longitude = data.results[0].geometry.location.lng;
      console.log(`Latitude: ${latitude}`);
      console.log(`Longitude: ${longitude}`);

      return new Address(address, latitude, longitude);
    } else {
      throw new Error('Erro ao obter as coordenadas');
    }
  } catch (error) {
    console.error("Ocorreu um erro ao obter as coordenadas:", error);
    throw error;
  }
}

async function obterTrajeto(departureAddress,destinationAddress) {
  try {
    const departureObj = await generateCoordinates(departureAddress);
    const destinationObj = await generateCoordinates(destinationAddress);

    const startPoint = new google.maps.LatLng(departureObj.latitude, departureObj.longitude);
    const endPoint = new google.maps.LatLng(destinationObj.latitude, destinationObj.longitude);

    const request = {
      origin: startPoint,
      destination: endPoint,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, function (result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);

        const steps = result.routes[0].legs[0].steps;
        const instructions = document.getElementById("instructions");
        
        while (instructions.firstChild) {
          instructions.removeChild(instructions.firstChild);
        }

        csvString = "";

        for (let i = 0; i < steps.length; i++) {
          const step = steps[i];
          const instruction = document.createElement("li");
          instruction.innerHTML = step.instructions;
          instructions.appendChild(instruction);

          csvString += instruction.innerText + "\n";
        }
      }
    });

    instructionsBox.style.display = "flex";
  } catch (error) {
    console.error("Ocorreu um erro:", error);
  }
}

btnGenerateRoutes.addEventListener("click",function(e) {
  departureAddress = ipDepartureAddress.value;
  destinationAddress = ipDestinationAddress.value;

  

  if(departureAddress == "") {
    ipDepartureAddress.classList.add("is-invalid");
  } else {
    ipDepartureAddress.classList.remove("is-invalid");
  }

  if(destinationAddress == "") {
    ipDestinationAddress.classList.add("is-invalid");
  } else {
    ipDestinationAddress.classList.remove("is-invalid");
  }

  if(departureAddress != "" && destinationAddress != "") {
    obterTrajeto(departureAddress,destinationAddress);
  }
});

btnDownloadInstructions.addEventListener("click", function(e) {
  var link = document.createElement("a");
  var csvData = "\ufeff" + csvString;

  var encodedUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvData);

  link.href = encodedUri;
  link.download = "Instruções.csv";
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});